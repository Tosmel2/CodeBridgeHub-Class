import React from 'react'
import './contact.css'

const Contact = () => {
  return (
    <>
        <form action="">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" placeholder="Enter Your Name" /><br /><br />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" /><br /><br />

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" /><br /><br />
            <input type="checkbox" id="subscribe" name="subscribe" />
            <label for="subscribe">Subscribe to our newsletter</label><br /><br />

            <label for="message">Message:</label><br />
            <textarea id="message" name="message" rows="4" cols="50" placeholder="Enter Your Messgae"></textarea><br /><br />

            <input type="submit" value="Submit" />
        </form>
    </>
  )
}

export default Contact