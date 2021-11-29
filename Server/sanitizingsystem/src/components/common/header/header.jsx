import React from 'react';
import './header.css'
import AppLogo from '../../../components/STL.svg'
import {Navbar} from '../../common';


function Header() {
    return (
        <section>
            <section id="top">
                
                <Navbar/>
            </section>

            <section id="undertop" >
                
                            
                               {/**  <a href="/" className="header-logo"> <img src={AppLogo} alt="logo" className="header-logo-img"/></a> */} 
            </section>
                
                            <section>
            </section>
        </section>
    )
}

export default Header;