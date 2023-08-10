import express from 'express';
import ContactService from '../../contact.service';

const router = express.Router();

router.post('/identify', async (req, res, next) => {
    const contactService = new ContactService();
    const {email, phoneNumber} = req.body;
    return contactService.serveIncomingRequest({email, phoneNumber}).then((data) => res.send(data)).catch((error) => res.send(error))
})

export default router;