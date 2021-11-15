import React from 'react';
import './header.css'
import {Navbar} from '../../common';


function Header() {
    return (
        <section className="header">
            <section className="header-top">
                <section className="header-top-logo">

                <a href="/" className="header-logo">LOGO</a>

                </section>
                <section className="header-top-navbar">
                    <Navbar/>
                </section>
                </section>
                <section className="header-bottom">
                    <section className="header-bottom-unused">
                    8675309
                        </section>
                        <section className="header-bottom-unused">
                        something something darkside
                            </section>
                            </section>
                            </section>
    )
}

export default Header;