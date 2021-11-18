import React from 'react';
import './header.css'
import AppLogo from '../../../components/STL.svg'
import {Navbar} from '../../common';


function Header() {
    return (
        <section className="header">
            <section className="header-top">
                        <section className="header-top-logo">
                               {/**  <a href="/" className="header-logo"> <img src={AppLogo} alt="logo" className="header-logo-img"/></a> */} 
                            <Navbar/>
                        </section>
                </section>
                            <section className="SideNavBar">
                            </section>
                            </section>
    )
}

export default Header;