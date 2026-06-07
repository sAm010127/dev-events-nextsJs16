import React from 'react';

const Navbar = () => {
    return (
        <header>
            <nav>
                <div className="logo">
                    <p>DevEvents</p>
                </div>
                <ul className={`list-none`}>
                    <li className={``}><a href="/">Home</a></li>
                    <li><a href="/events">Events</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;