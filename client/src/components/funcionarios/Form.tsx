import React, { FormEvent, useState } from 'react';


interface FormValues {
  name: string;
  email: string;
}

export const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormValues>({ name: '', email: '' });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email } = e.currentTarget;
    if (name && email) {
      const formData: FormValues = {
        name: name.value,
        email: email.value,
      };
      setFormData(formData);
      console.log(formData);
    }
  };

  return (
    <div className='bg-white h-10' >
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:
          <input type="text" id="name" name="name" required/><br />
        </label><br />
        <label htmlFor="email">Email:
          <input type="email" id="email" name="email"/><br />
        </label><br />
        <button type="submit">Enviar</button>
      </form>

    </div>
  
  );
};
