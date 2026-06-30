import React from 'react'

const Navbar = () => {
  return (
    <>
        <nav style={{ color: "blue", backgroundColor: "lightgray", padding: "20px" }}>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/programs">Programs</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    </>
  )
}

export default Navbar