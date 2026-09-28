import {
    LegalBlock,
    LegalContents,
    LegalLink,
    LegalList,
    LegalPage,
    LegalSection,
} from './LegalLayout';

// Copied from https://veritaspathways.co.uk/policy/, where the three sections
// are tabs. The franchisee statement there was pasted from a PDF with broken
// line wraps and capitalisation; the wording is unchanged, only reflowed.
const FRANCHISEE_PDF =
    'https://veritaspathways.co.uk/wp-content/uploads/2025/09/Franchisee-Disclosure-Statement.pdf';

const sections = [
    { id: 'privacy-notice', label: 'Privacy notice' },
    { id: 'franchisee-disclosure', label: 'Franchisee disclosure statement' },
    { id: 'disclaimer', label: 'Disclaimer' },
];

const PrivacyPolicy = () => (
    <LegalPage title="Privacy policy">
        <LegalContents items={sections} />

        <LegalSection id="privacy-notice" title="Privacy notice">
            <LegalBlock>
                <p>
                    Veritas Pathways Ltd is the data controller for the personal information collected through this
                    website and during the student enquiry and application process. We use personal information to
                    respond to enquiries, assess applications, communicate with applicants and students, support
                    student recruitment and progression processes, meet legal and regulatory obligations, and improve
                    our services.
                </p>
            </LegalBlock>

            <LegalBlock title="Personal identification information">
                <p>
                    We may collect personal information such as name, email address, telephone number, nationality,
                    academic history, English language qualifications, passport details where required for enrolment
                    administration, and other information you choose to provide when you submit an enquiry,
                    application, or related form.
                </p>
                <p>
                    We will collect personal identification information from Users only if they voluntarily submit
                    such information to us. Users can always refuse to supply personal identification information,
                    except that it may prevent them from engaging in certain Site-related activities.
                </p>
            </LegalBlock>

            <LegalBlock title="Non-personal identification information">
                <p>
                    We may collect non-personal identification information about Users whenever they interact with
                    our Site. Non-personal identification information may include the browser name, the type of
                    computer and technical information about Users’ means of connection to our Site, such as the
                    operating system and the Internet service providers utilised and other similar information.
                </p>
            </LegalBlock>

            <LegalBlock title="Web browser cookies">
                <p>
                    Our Site may use “cookies” to enhance User experience. User’s web browser places cookies on their
                    hard drive for record-keeping purposes and sometimes to track information about them. User may
                    choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If
                    they do so, note that some parts of the Site may not function properly.
                </p>
            </LegalBlock>

            <LegalBlock title="How we use collected information">
                <p>
                    VERITAS PATHWAYS may collect and use Users’ personal information for the following purposes:
                </p>
                <LegalList
                    items={[
                        'To run and operate our Site: We may need your information to display content on the Site correctly.',
                        'To improve customer service: Information you provide helps us respond to your customer service requests and support needs more efficiently.',
                        'To personalise user experience: We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.',
                        'To improve our Site: We may use feedback you provide to improve our products and services.',
                        'To run a promotion, contest, survey or other Site feature: To send Users information they agreed to receive about topics we think will be of interest to them.',
                        'To send periodic emails: We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their enquiries, questions, and/or other requests.',
                    ]}
                />
            </LegalBlock>

            <LegalBlock title="How we protect your information">
                <p>
                    We adopt appropriate data collection, storage and processing practices and security measures to
                    protect against unauthorised access, alteration, disclosure or destruction of your personal
                    information, username, password, transaction information and data stored on our Site.
                </p>
            </LegalBlock>

            <LegalBlock title="Sharing your personal information">
                <p>
                    We do not sell, trade, or rent Users’ personal identification information to others. We may share
                    generic aggregated demographic information not linked to any personal identification information
                    regarding visitors and users with our business partners, trusted affiliates and advertisers for
                    the purposes outlined above. We may use third-party service providers to help us operate our
                    business and the Site or administer activities on our behalf, such as sending out newsletters or
                    surveys. We may share your information with these third parties for those limited purposes if you
                    have given us your permission.
                </p>
            </LegalBlock>

            <LegalBlock title="Electronic newsletters">
                <p>
                    If User decides to opt in to our mailing list, they will receive emails that may include company
                    news, updates, related product or service information, etc. If at any time the User would like to
                    unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the
                    bottom of each email or User may contact us via our Site. We may use third-party service providers
                    to help us operate our business and the Site or administer activities on our behalf, such as
                    sending out newsletters or surveys. We may share your information with these third parties for
                    those limited purposes if you have given us your permission.
                </p>
            </LegalBlock>

            <LegalBlock title="Third-party websites">
                <p>
                    Users may find advertising or other content on our Site that links to the sites and services of our
                    partners, suppliers, advertisers, sponsors, licensors and other third parties. We do not control
                    the content or links that appear on these sites and are not responsible for the practices
                    employed by websites linked to or from our Site. In addition, these sites or services, including
                    their content and links, may be constantly changing. These sites and services may have their own
                    privacy policies and customer service policies. Browsing and interaction on any other website,
                    including websites which have a link to our Site, is subject to that website’s own terms and
                    policies.
                </p>
            </LegalBlock>

            <LegalBlock title="Advertising">
                <p>
                    Ads appearing on our site may be delivered to Users by advertising partners, who may set cookies.
                    These cookies allow the ad server to recognise your computer each time they send you an online
                    advertisement to compile non-personal identification information about you or others who use your
                    computer. This information allows ad networks to, among other things, deliver targeted
                    advertisements that they believe will be of most interest to you. This privacy policy does not
                    cover the use of cookies by any advertisers.
                </p>
            </LegalBlock>

            <LegalBlock title="Google AdSense">
                <p>
                    Some of the ads may be served by Google. Google’s use of the DART cookie enables it to serve ads to
                    Users based on their visit to our Site and other sites on the Internet. DART uses “non-personally
                    identifiable information” and does NOT track personal information about you, such as your name,
                    email address, physical address, etc. You may opt out of the use of the DART cookie by visiting
                    the Google ad and content network privacy policy at{' '}
                    <LegalLink href="http://www.google.com/privacy_ads.html">
                        http://www.google.com/privacy_ads.html
                    </LegalLink>
                </p>
            </LegalBlock>

            <LegalBlock title="Compliance with the Children’s Online Privacy Protection Act">
                <p>
                    Protecting the privacy of the very young is especially important. For that reason, we never
                    collect or maintain information at our Site from those we know are under 13, and no part of our
                    website is structured to attract anyone under 13.
                </p>
            </LegalBlock>

            <LegalBlock title="Changes to this privacy policy">
                <p>
                    VERITAS PATHWAYS has the discretion to update this privacy policy at any time. When we do, we will
                    post a notification on the main page of our Site, revise the updated date at the bottom of this
                    page and send you an email. We encourage Users to frequently check this page for any changes to
                    stay informed about how we are helping to protect the personal information we collect. You
                    acknowledge and agree that it is your responsibility to review this privacy policy periodically
                    and become aware of modifications.
                </p>
            </LegalBlock>

            <LegalBlock title="Your acceptance of these terms">
                <p>
                    By using this Site, you signify your acceptance of this policy. If you do not agree to this
                    policy, please do not use our Site. Your continued use of the Site following the posting of
                    changes to this policy will be deemed your acceptance of those changes.
                </p>
            </LegalBlock>

            <LegalBlock title="Contact us">
                <p>
                    If you have any questions about this Privacy Policy, the practices of this site, or your dealings
                    with this site, please contact us:{' '}
                    <LegalLink href="mailto:info@veritaspathways.co.uk">info@veritaspathways.co.uk</LegalLink>
                </p>
            </LegalBlock>
        </LegalSection>

        <LegalSection id="franchisee-disclosure" title="Franchisee disclosure statement">
            <p className="text-gray-700">
                <LegalLink href={FRANCHISEE_PDF}>Download the Franchisee Disclosure Statement (PDF)</LegalLink>
            </p>

            <LegalBlock title="About the franchisor">
                <p>
                    International Foundation Group (IFG) is the lead institution offering the following Foundation
                    programmes.
                </p>
                <LegalList
                    items={[
                        'University foundation in business',
                        'University foundation in computer sciences',
                        'University foundation in social sciences',
                        'Foundation in engineering',
                        'Medical foundation',
                    ]}
                />
                <p>
                    Established in 2017, IFG has a proven track record of delivering high-quality education and
                    enabling students to progress to university/medical school through approved progression
                    agreements.
                </p>
                <p>
                    The IFG leadership team includes experienced educators, curriculum developers, and industry
                    specialists committed to ensuring that every franchise partner benefits from the expertise and
                    reputation of our organisation.
                </p>
            </LegalBlock>

            <LegalBlock title="Accreditation and recognition">
                <p>The foundation programmes are accredited/recognised:</p>
                <LegalList
                    items={[
                        'University foundation in business – endorsed by ATHE, an Ofqual authorised awarding body',
                        'University foundation in computer sciences – endorsed by ATHE, an Ofqual authorised awarding body',
                        'University foundation in social sciences – endorsed by ATHE, an Ofqual authorised awarding body',
                        'University foundation in engineering – endorsed by ATHE, an Ofqual authorised awarding body',
                        'Medical foundation – accredited by NCFE, an Ofqual authorised awarding body',
                    ]}
                />
            </LegalBlock>

            <LegalBlock title="Quality assurance">
                <p>Quality assurance is central to our franchise model. The franchisor provides:</p>
                <LegalList
                    items={[
                        'Curriculum oversight: all teaching materials are developed, reviewed, and updated by IFG.',
                        'Training and support: franchisees and their teaching staff receive comprehensive induction training and ongoing professional development.',
                        'Monitoring & evaluation: regular audits, feedback reviews, and teaching observations are conducted to maintain consistency and excellence across all franchise locations.',
                        'Feedback systems: students and parents are encouraged to share feedback, which is used to continuously improve the programme.',
                    ]}
                />
            </LegalBlock>

            <LegalBlock title="Student protection">
                <p>
                    We are committed to safeguarding the interests of all learners enrolled through our franchise
                    network. Our policies include:
                </p>
                <LegalList
                    items={[
                        'Safeguarding and child protection: all staff undergo background checks and follow strict safeguarding protocols.',
                        // Placeholder carried over from the live page as published.
                        'Data protection: student records and personal information are handled in compliance with [local data protection law, e.g. GDPR].',
                        'Fair refund and complaints policy: clear procedures are in place to ensure students and parents are treated fairly in the event of disputes or withdrawal.',
                        'Continuity of learning: in the unlikely event of disruption at a franchise centre, IFG ensures alternative arrangements to minimise impact on learners.',
                    ]}
                />
            </LegalBlock>

            <LegalBlock title="Progression pathways">
                <p>
                    IFG has approved progression pathway agreements with multiple UK universities, UK and international
                    medical schools, Australian universities and UK universities in the UAE.
                </p>
                <p>
                    The progression pathway agreements are owned and managed by IFG, and the franchisee students can
                    access progression through IFG.
                </p>
                <p>Further detail: university pathways: progression routes to the UK &amp; Australia.</p>
            </LegalBlock>
        </LegalSection>

        <LegalSection id="disclaimer" title="Website disclaimer">
            <LegalBlock>
                <p>
                    The information published on this website is provided by Veritas Pathways Ltd for general
                    informational purposes only. Whilst every reasonable effort is made to ensure accuracy at the time
                    of publication, the institution reserves the right to amend programme details, entry
                    requirements, fees, policies and other published information where necessary.
                </p>
                <p>
                    Nothing on this website constitutes a legally binding offer. A contractual relationship arises
                    only upon formal acceptance of an offer of admission and compliance with the institution’s terms
                    and conditions.
                </p>
                <p>
                    Veritas Pathways Ltd operates in accordance with applicable UK legislation, including the Consumer
                    Rights Act 2015 and the Data Protection Act 2018. References to progression opportunities,
                    partnerships or future institutional developments are subject to regulatory approval and formal
                    agreement where required.
                </p>
                <p>
                    Veritas Pathways Ltd accepts no liability for reliance placed on information contained within
                    external links provided on this website.
                </p>
                <p>
                    For formal enquiries, please contact:{' '}
                    <LegalLink href="mailto:info@veritaspathways.co.uk">info@veritaspathways.co.uk</LegalLink>
                </p>
            </LegalBlock>
        </LegalSection>
    </LegalPage>
);

export default PrivacyPolicy;
