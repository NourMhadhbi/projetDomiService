// src/components/ContactForm.js
import React, { useState } from 'react';


const ContactForm = ({ isClientConnected,user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire soumis :', formData);
    alert('Message envoyé avec succès !');
  };

  return (
    <section className="contact-wrapper">
      <div className="contact-box">
        <h2 className="contact-title">
          Contactez <span>-moi</span> maintenant
        </h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-row">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Votre nom" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Adresse email" required />
          </div>
          <div className="contact-row">
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Numéro de téléphone" required />
            <select name="subject" value={formData.subject} onChange={handleChange} required>
              <option value="">Sélectionnez le sujet</option>
              <option value="Demande générale">Demande générale</option>
              <option value="Service technique">Service technique</option>
              <option value="Support">Support</option>
            </select>
          </div>
          <textarea
            name="message"
            rows="5"
            placeholder="Votre message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="contact-su"
            disabled={!isClientConnected || user?.utilisateur.role === 'ADMIN'}
          >
            SOUMETTRE MAINTENANT
          </button>

        </form>
      </div>
      <style>{`.contact-wrapper {
  background-color: #ffffffff;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}
.contact-su:disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
.contact-box {
  width: 100%;
  max-width: 1000px;
    background-color: #e5e5e5ff;

  padding: 40px;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
}

.contact-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
}

.contact-title span {
  color: #f0380f;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.contact-row input,
.contact-row select {
  flex: 1;
  padding: 14px;
  border: none;
  background: #f5f5f5;
  font-size: 16px;
  border-radius: 2px;
}

.contact-form textarea {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  border: none;
  background: #f5f5f5;
  resize: none;
  border-radius: 2px;
}

.contact-su {
   background-color: #e6471d;
  color: #fff;
  border: none;
  padding: 14px 28px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-align: center;
  text-transform: uppercase;
}

.contact-su:hover {
  background-color: #d93108;
}
`}</style>
    </section>
  );
};

export default ContactForm;
