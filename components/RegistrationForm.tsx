
import React, { useState, useEffect } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface Errors {
  name?: string;
  email?: string;
  organization?: string;
}

// IMPORTANT: This URL points to the Google Apps Script that saves data to the Google Sheet.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxPzOx_XjIoRWO32qVlzD_RrvrXlJ9yy6rS00d6dFj4NZ6Y1Ti-_UO2vH09mwuENlNeA/exec';

const RegistrationForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    let timer: number;
    if (status === 'success') {
      timer = window.setTimeout(() => {
        setStatus('idle');
        setName('');
        setEmail('');
        setOrganization('');
      }, 4000); // Reset form after 4 seconds
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [status]);

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!name.trim()) newErrors.name = 'Le nom est requis.';
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'L\'adresse email est invalide.';
    }
    if (!organization.trim()) newErrors.organization = 'L\'organisation est requise.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    
    setStatus('submitting');
    setErrors({});
    setServerError(null);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('organization', organization);
    
    try {
      // The `mode: 'no-cors'` is the crucial change.
      // Google Apps Script performs a 302 redirect after a POST request.
      // Browsers block this cross-origin redirect, causing a "Failed to fetch" error
      // even if the script ran successfully.
      // 'no-cors' mode sends the request but doesn't allow the client to read the response.
      // This prevents the redirect error from being thrown.
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });

      // Since 'no-cors' mode results in an opaque response, we cannot read the
      // actual success message from the script. We optimistically assume success
      // if the fetch call itself doesn't throw a network error.
      setStatus('success');

    } catch (error: any) {
      // This will now only catch actual network errors (e.g., user is offline),
      // not the misleading CORS redirect error.
      console.error('An error occurred during form submission:', error);
      setServerError('Une erreur de réseau s\'est produite. Veuillez vérifier votre connexion.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center p-8 bg-green-500/10 border border-neon-green rounded-lg animate-fade-in-up">
        <CheckCircleIcon />
        <h3 className="text-2xl font-bold text-neon-green mt-4">Inscription Réussie!</h3>
        <p className="text-gray-300 mt-2">Merci de vous être inscrit. Nous avons hâte de vous voir à l'événement!</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center p-8 bg-red-500/10 border border-red-400 rounded-lg animate-fade-in-up">
        <ErrorIcon />
        <h3 className="text-2xl font-bold text-red-400 mt-4">Erreur d'Inscription</h3>
        <p className="text-gray-300 mt-2">
          Une erreur s'est produite. Veuillez réessayer plus tard.
        </p>
        {serverError && <p className="text-red-300 text-sm mt-2">Détail: {serverError}</p>}
        <p className="text-yellow-400 text-xs mt-4 p-2 bg-yellow-900/20 rounded">
          <strong>Astuce de Dépannage:</strong> Si l'erreur persiste, vérifiez les journaux d'exécution ("Executions") dans votre projet Google Apps Script pour voir l'erreur exacte côté serveur.
        </p>
        <button
          onClick={() => { setStatus('idle'); setErrors({}); setServerError(null); }}
          className="mt-6 font-orbitron py-2 px-4 bg-neon-green text-dark-purple font-bold rounded-md hover:bg-white transition-all duration-300"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-6">
      <div className="relative">
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom Complet"
          className="w-full px-4 py-3 bg-white/5 border border-neon-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green/80 focus:border-neon-green text-white transition-all duration-300 peer placeholder-transparent"
        />
        <label htmlFor="name" className="absolute left-4 -top-3.5 text-neon-green text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-neon-green peer-focus:text-sm">
          Nom Complet
        </label>
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>
      <div className="relative">
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresse Email"
          className="w-full px-4 py-3 bg-white/5 border border-neon-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green/80 focus:border-neon-green text-white transition-all duration-300 peer placeholder-transparent"
        />
        <label htmlFor="email" className="absolute left-4 -top-3.5 text-neon-green text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-neon-green peer-focus:text-sm">
          Adresse Email
        </label>
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
      </div>
      <div className="relative">
        <input
          id="organization"
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="Organisation / Entreprise"
          className="w-full px-4 py-3 bg-white/5 border border-neon-green/30 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green/80 focus:border-neon-green text-white transition-all duration-300 peer placeholder-transparent"
        />
        <label htmlFor="organization" className="absolute left-4 -top-3.5 text-neon-green text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-neon-green peer-focus:text-sm">
          Organisation / Entreprise
        </label>
        {errors.organization && <p className="text-red-400 text-sm mt-1">{errors.organization}</p>}
      </div>
      <button 
        type="submit" 
        disabled={status === 'submitting'}
        className="w-full font-orbitron py-3 px-6 bg-neon-green text-dark-purple font-bold rounded-md hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center animate-glow"
      >
        {status === 'submitting' ? (
          <>
            <SpinnerIcon />
            Envoi en cours...
          </>
        ) : (
          "S'inscrire Maintenant"
        )}
      </button>
    </form>
  );
};


const CheckCircleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neon-green mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ErrorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default RegistrationForm;
