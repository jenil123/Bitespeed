import { Op } from "sequelize";
import { Contact } from "./models";

export default class ContactService {
    async handleLoginRequest(data: {
        email?: string,
        phoneNumber?: string
    }) {
        const {email, phoneNumber} = data;
        // find by email and phone number
            const existingContact = await Contact.findOne({where: {email, phoneNumber}});
            const condition = [];
            if(phoneNumber) {
                condition.push({'phoneNumber': phoneNumber})
            }
            if(email) {
                condition.push({'email': email});
            }
            if(!existingContact) {
                // does not exists which means either email or phone number or none is common
                
                const matchingContacts = await Contact.findAll({where: { 
                    [Op.or]: condition,
                }, order: [
                    ['createdAt', 'ASC']
                ]});
                if(!matchingContacts.length) {
                    // meaning first entry
                    await Contact.create({
                        linkPrecedence: 'primary',
                        linkedId: undefined,
                        email,
                        phoneNumber
                    })
                } else {
                    // some are matching
                    const oldestContact = matchingContacts[0];
                    const Promises = []
                    for(let index=1; index< matchingContacts.length;index++) {
                        const currentContact = matchingContacts[index];
                        if((currentContact.email === email || currentContact.phoneNumber ===  phoneNumber)) {
                            // email is same but phone number not
                            Promises.push(Contact.upsert({
                                id: currentContact.id,
                                linkPrecedence: 'secondary',
                                linkedId: oldestContact.linkedId ?? oldestContact.id
                            }))
                        }
                    }
                    if(Promises.length) {
                        await Promise.all(Promises);
                    }

                    await Contact.create({
                        linkPrecedence: 'secondary',
                        linkedId: oldestContact.linkedId ?? oldestContact.id,
                        email,
                        phoneNumber
                    })
                }
            }
            return Contact.findAll({where: { 
                [Op.or]: condition,
            }, order: [
                ['createdAt', 'ASC']
            ]});
    }

    async serveIncomingRequest(data: {email: string, phoneNumber: string}) {
        const response = await this.handleLoginRequest(data);
        const primaryContact = response[0];
        const emails = [... new Set(response.map((contact) => contact.email))];
        const phoneNumbers = [... new Set(response.map((contact) => contact.phoneNumber))];
        const secondaryContactIds = response.filter((contact) => contact.linkPrecedence !== 'primary').map((secondaryContact) => secondaryContact.id);
        return {
            contact: {
                primaryContatctId: primaryContact.linkedId ?? primaryContact.id,
                emails,
                phoneNumbers,
                secondaryContactIds
            }
        }
    }
}