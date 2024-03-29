import React, { useState } from 'react';
import './Contact.css';
import emailjs from '@emailjs/browser';
import { Helmet } from 'react-helmet';
import mainlogo from '../../assets/images/favicon.ico';

import { ReactComponent as MySVG } from "../../up.svg";
import ScrollToTop from "react-scroll-to-top";
import * as EmailValidator from 'email-validator';
const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const userId = process.env.REACT_APP_EMAILJS_USER_ID;




const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    need: 'Add New Exam',
    message: ''
  });
  const [messageStatus, setMessageStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    

  if (!EmailValidator.validate(formData.email)) {
    console.log('Validation failed, email:', formData.email);
    alert('Please enter a valid email address.');
    return;
  }

    emailjs.sendForm(serviceId, templateId, e.target, userId)
      .then((result) => {
       
        setMessageStatus('Message sent successfully!');
        // Optionally reset form fields here after successful submission
        setFormData({
          name: '',
          surname: '',
          email: '',
          need: 'Add New Exam',
          message: ''
        });
      })
      .catch((error) => {
        console.log(error.text);
        setMessageStatus('Failed to send message. Please try again later.');
      });
  };

  return (
    <div className="body">
    <Helmet>
    <title>Exam Tards | Contact Us</title>
    <meta
      name="description"
      content="Contact Exam Tards and help in contributing towards the best place an aspirant can have." 
    />
    <meta name="keywords" content="contact us,examtards contact us,request an exam examtards,colab examtards,report a bug"></meta>
    <meta property="og:title" content="Exam Tards | Contact Us"></meta>
  <meta property="og:description" content="Contact Exam Tards and helo in contributing towards the best place an aspirant can have."  ></meta>
<meta property="og:image" content={mainlogo}></meta>
  </Helmet>
    <div className='banner'>
    <div className="row px-4">
      <div className="col-md-7 col-sm-12">
        <div className="content c-2 mt-5">
          <h1 className=''>Request an Exam</h1>
          <h5>Join us in building the ultimate exams repository! Your contribution makes it the go-to resource for all. Help us create the one-stop destination for exams excellence.</h5>
        </div>
      </div>
    </div>
  </div>

  <section id="contact">
  <div className="row">
    <div className="col-lg-7 col-md-10 col-sm-12 mx-auto">
      <div className="card-x mt-2 mx-auto p-4">
        <div className="card-x-body">
          <form id="contact-form" role="form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="form_name">Firstname *</label>
                  <input
                    id="form_name"
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Please enter your firstname *"
                    required="required"
                    data-error="Firstname is required."
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="form_lastname">Lastname *</label>
                  <input
                    id="form_lastname"
                    type="text"
                    name="surname"
                    className="form-control"
                    placeholder="Please enter your lastname *"
                    required="required"
                    data-error="Lastname is required."
                    value={formData.surname}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="form_email">Email *</label>
                <input
                  id="form_email"
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Please enter your email *"
                  required="required"
                  data-error="Valid email is required."
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="form_need">Please specify your need *</label>
                <select
                  id="form_need"
                  name="need"
                  className="form-control"
                  required="required"
                  data-error="Please specify your need."
                  value={formData.need}
                  onChange={handleChange}
                >
                  <option value="none"  disabled>-- Your Issue--</option>
                  <option value="Add New Exam">Add New Exam</option>
                  <option value="Report Bug">Report Bug</option>
                  <option value="Collaborate">Collaborate</option>
                  <option value="New Feature Required">New Feature Required</option>
                  <option value="Something Else">Something Else</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="form_message">Message *</label>
              <textarea
                id="form_message"
                name="message"
                className="form-control"
                placeholder="Write your message here."
                rows="4"
                required="required"
                data-error="Please, leave us a message."
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="col-md-12">

            <input
              type="submit"
              className="btn btn-primary btn-send pt-2 btn-block"
              value="Send Message"
            />
            {messageStatus && (
              <div className={`alert mt-5 ${messageStatus.includes('Failed') ? 'alert-danger' : 'alert-success'}`} role="alert">
                {messageStatus}
              </div>
            )}
          </div>
        </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>


 
    <ScrollToTop smooth component={<MySVG />} />
    </div>
  );
};

export default Contact;
