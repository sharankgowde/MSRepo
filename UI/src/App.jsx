import { useState } from "react";

function validateForm(data) {
  const nextErrors = {};
  const namePattern = /^[a-zA-Z ]+$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\d{10}$/;

  if (!data.name.trim()) {
    nextErrors.name = "Name is required.";
  } else if (data.name.trim().length < 2) {
    nextErrors.name = "Name must be at least 2 characters.";
  } else if (!namePattern.test(data.name.trim())) {
    nextErrors.name = "Name can only contain letters and spaces.";
  }

  if (!data.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!emailPattern.test(data.email.trim())) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!data.phone.trim()) {
    nextErrors.phone = "Phone number is required.";
  } else if (!phonePattern.test(data.phone.trim())) {
    nextErrors.phone = "Phone number must be exactly 10 digits.";
  }

  return nextErrors;
}

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const isFormValid = Object.keys(validateForm(formData)).length === 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    const sanitizedValue = name === "phone" ? value.replace(/\D/g, "") : value;
    const nextData = {
      ...formData,
      [name]: sanitizedValue
    };

    setFormData((previousData) => ({
      ...previousData,
      [name]: sanitizedValue
    }));
    setErrors(validateForm(nextData));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm(formData);
    setShowErrors(true);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className="page">
      <section className="card" aria-label="Event registration form">
        <h1>Event Registration</h1>
        <p>Fill in your details to register for the event.</p>

        <form onSubmit={handleSubmit} className="form" noValidate>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            aria-invalid={Boolean(showErrors && errors.name)}
            className={showErrors && errors.name ? "input-error" : ""}
            required
          />
          {showErrors && errors.name && <p className="field-error">{errors.name}</p>}

          <label htmlFor="email">Email ID</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            aria-invalid={Boolean(showErrors && errors.email)}
            className={showErrors && errors.email ? "input-error" : ""}
            required
          />
          {showErrors && errors.email && <p className="field-error">{errors.email}</p>}

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            inputMode="numeric"
            maxLength={10}
            aria-invalid={Boolean(showErrors && errors.phone)}
            className={showErrors && errors.phone ? "input-error" : ""}
            required
          />
          {showErrors && errors.phone && <p className="field-error">{errors.phone}</p>}

          <button type="submit" disabled={!isFormValid}>
            Register
          </button>
        </form>

        {submitted && (
          <p className="success" role="status">
            Registration details captured locally. API integration is pending.
          </p>
        )}
      </section>
    </main>
  );
}
