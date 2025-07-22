// src/components/ContactForm.js
import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'Demande générale',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ici, vous pouvez ajouter la logique pour envoyer le formulaire
        console.log('Formulaire soumis:', formData);
        alert('Message envoyé avec succès!');
    };

    return (
        <div className="section">
            <h2 className="section-title">Contactez-moi</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Votre nom :</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Entrez votre nom"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Adresse email :</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Entrez votre email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Numéro de téléphone :</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Entrez votre numéro"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="subject">Sujet :</label>
                    <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                    >
                        <option value="Demande générale">Demande générale</option>
                        <option value="Services électriques">Services électriques</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Service d'urgence">Service d'urgence</option>
                    </select>
                </div>

                <div className="form-group full-width">
                    <label htmlFor="message">Votre message :</label>
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Décrivez votre projet..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="form-group full-width">
                    <button type="submit" className="submit-btn">Envoyer le message</button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;