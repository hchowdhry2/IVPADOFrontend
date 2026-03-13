import React, { useState } from 'react';
import '../../styles/Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('home');

    const toggleMenu = () => {
        setIsOpen(prevState => !prevState);
    };

    const setActive = (itemId) => {
        setActiveItem(itemId);
        setIsOpen(false);
    };

    const navItems = [
        { id: 'home', label: 'Home', path: '/' },
        { id: 'burnup', label: 'Burnup Chart', path: '/burnup' },
        { id: 'sprints', label: 'Sprints', path: '/sprints' },
        { id: 'backlog', label: 'Backlog', path: '/backlog' },
        { id: 'reports', label: 'Reports', path: '/reports' },
        { id: 'settings', label: 'Settings', path: '/settings' }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">SRM DevOps</div>
                
                {/* <button className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </button> */}

                <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a
                                href={item.path}
                                className={`nav-link ${activeItem === item.id ? 'active' : ''}`}
                                onClick={() => setActive(item.id)}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;