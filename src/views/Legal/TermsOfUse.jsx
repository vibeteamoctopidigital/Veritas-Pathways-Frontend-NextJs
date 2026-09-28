import { LegalBlock, LegalPage, LegalSection } from './LegalLayout';

// Copied from https://veritaspathways.co.uk/terms-and-conditions/. The three
// "[link]" placeholders are unfilled on the live page too.
const terms = [
    {
        title: '1. Use of site',
        body: 'You agree to use the Site only for lawful purposes. You must not use the Site in any way that breaches any applicable local, national, or international law or regulation.',
    },
    {
        title: '2. Intellectual property rights',
        body: 'All content published and made available on our Site is the property of VERITAS PATHWAYS and the Site’s creators. This includes, but is not limited to, text, logos, images, graphics, documents, downloadable files, and anything that contributes to the composition of our Site.',
    },
    {
        title: '3. User accounts',
        body: 'When you create an account on our Site, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account and password.',
    },
    {
        title: '4. Limitation of liability',
        body: 'VERITAS PATHWAYS will not be liable for any direct, indirect, incidental, consequential, or punitive damages resulting from your use of or inability to use the Site.',
    },
    {
        title: '5. External links',
        body: 'Our Site may contain links to third-party websites that are not owned or controlled by VERITAS PATHWAYS. We are not responsible for the content or privacy practices of any third-party sites.',
    },
    {
        title: '6. Termination',
        body: 'We may suspend or terminate your access to the Site immediately without prior notice or liability if you breach these Terms.',
    },
    {
        title: '7. Governing law',
        body: 'These Terms are governed by the laws of England and Wales. Any disputes will be handled in the courts of the United Kingdom.',
    },
    {
        title: '8. Refund policy',
        body: 'Students who withdraw from their programme may be entitled to a partial or full refund in accordance with our published Refund and Compensation Policy, available at [link]. Refund entitlements are calculated in accordance with the Consumer Rights Act 2015.',
    },
    {
        title: '9. Complaints procedure',
        body: 'Students who wish to raise a concern or complaint should refer to our Student Complaints Procedure, available at [link]. Where a complaint remains unresolved, students may refer the matter to the relevant independent complaints body.',
    },
    {
        title: '10. Academic appeals',
        body: 'Students have the right to appeal against academic decisions. Full details of the Academic Appeals Procedure are set out in the Student Handbook, available at [link].',
    },
    {
        title: '11. Changes to terms',
        body: 'We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Site after changes are posted constitutes your acceptance of the new Terms.',
    },
];

const TermsOfUse = () => (
    <LegalPage
        title="Terms and conditions"
        intro="Veritas Pathways Ltd provides student recruitment support, application support, enrolment administration, and access to approved pathway programmes delivered in partnership with International Foundation Group (IFG) where stated. We do not provide immigration advice, legal advice, or guaranteed admission to any university. Final admissions and progression decisions are made by the relevant institution in accordance with its published requirements. If you do not agree with any part of the Terms, you must not use the Site."
    >
        <LegalSection id="terms" title="Terms of use">
            {terms.map((term) => (
                <LegalBlock key={term.title} title={term.title}>
                    <p>{term.body}</p>
                </LegalBlock>
            ))}
        </LegalSection>
    </LegalPage>
);

export default TermsOfUse;
