import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <Link to="/privacy">Privacy Policy</Link>
        </footer>
    );
};

export default Footer;
