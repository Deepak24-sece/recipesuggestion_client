import React from 'react';

const Contact = () => {
    return (
        <div className="form-container">
            <h1>Contact Us</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <label>Name:</label>
                <input type="text" placeholder="Your Name" />

                <label>Email:</label>
                <input type="email" placeholder="Your Email" />

                <label>Message:</label>
                <textarea style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }} rows="5" placeholder="Your Message"></textarea>

                <button type="submit">Send Message</button>
            </form>
        </div>
    );
};

export default Contact;
