import * as yup from 'yup';

const validationSchema = yup.object({
    nom: yup.string().required("Le nom est obligatoire"),
    prenom: yup.string().required("Le prénom est obligatoire"),
    role: yup.string().required("Le rôle est obligatoire"),

    email: yup.string().email("Veuillez saisir un email valide").notRequired(),

    numTel: yup
        .string()
        .matches(/^\d{8}$/, "Le numéro doit contenir exactement 8 chiffres")
        .notRequired(),

    motDePasse: yup
        .string()
        .required("Le mot de passe est obligatoire")
        .min(8, "Minimum 8 caractères")
        .matches(/[0-9]/, "Doit contenir un chiffre")
        .matches(/[^a-zA-Z0-9]/, "Doit contenir un symbole"),

    confirmationMotDePasse: yup
        .string()
        .oneOf([yup.ref('motDePasse'), null], "Les mots de passe ne correspondent pas")
        .required("La confirmation est obligatoire"),

    genre: yup.string().required("Le genre est obligatoire"),
    adresse: yup.string().required("L'adresse est obligatoire"),
    ville: yup.string().required("La ville est obligatoire"),

    identifiant: yup.string().when('role', {
        is: 'ENTREPRISE',
        then: yup.string().required("L'identifiant unique est obligatoire"),
        otherwise: yup.string().notRequired(),
    }),

    nomEntreprise: yup.string().when('role', {
        is: 'ENTREPRISE',
        then: yup.string().required("Le nom entreprise est obligatoire"),
        otherwise: yup.string().notRequired(),
    }),

    serviceId: yup.number()
        .typeError('Le service est obligatoire')
        .when('role', {
            is: (role) => role === 'ENTREPRISE' || role === 'PRESTATAIRE',
            then: yup.number().required('Le service est obligatoire'),
            otherwise: yup.number().notRequired(),
        }),


}).test(
    'emailOrNumTel',
    'Veuillez fournir au moins un email ou un numéro de téléphone valide',
    (obj) => {
        // Au moins email ou numTel doit être non vide
        return Boolean(
            (obj.email && obj.email.trim() !== '') ||
            (obj.numTel && obj.numTel.trim() !== '')
        );
    }
);

export default validationSchema;
