// Subject tile photography, downloaded from the live site so the page does not
// hotlink veritaspathways.co.uk.
//
// Chemistry has no dedicated image on the live page, so it falls back to the
// generic tile used there (Rectangle-9435-3). Drop a Chemistry.jpg in and swap
// the import when one exists.
import ArtDesign from '../../assets/ify/subjects/Art-Design.jpg';
import Biology from '../../assets/ify/subjects/Biology.jpg';
import BusinessStudies from '../../assets/ify/subjects/Business-Studies.jpg';
import Chemistry from '../../assets/ify/subjects/Chemistry.webp';
import ComputerScience from '../../assets/ify/subjects/Computer-Science.jpg';
import Economics from '../../assets/ify/subjects/Economics.jpg';
import FurtherMaths from '../../assets/ify/subjects/Further-Maths.jpg';
import GlobalStudies from '../../assets/ify/subjects/Global-Studies.jpg';
import IntegratedMaths from '../../assets/ify/subjects/Integrated-Maths.jpg';
import Physics from '../../assets/ify/subjects/Physics.jpg';
import Sociology from '../../assets/ify/subjects/Sociology.jpg';
import TechnicalMaths from '../../assets/ify/subjects/Technical-Maths.jpg';

export const subjectTiles = [
    { name: 'Art & Design', image: ArtDesign },
    { name: 'Biology', image: Biology },
    { name: 'Business Studies', image: BusinessStudies },
    { name: 'Chemistry', image: Chemistry },
    { name: 'Computer Science', image: ComputerScience },
    { name: 'Economics', image: Economics },
    { name: 'Further Maths', image: FurtherMaths },
    { name: 'Global Studies', image: GlobalStudies },
    { name: 'Integrated Maths', image: IntegratedMaths },
    { name: 'Physics', image: Physics },
    { name: 'Sociology', image: Sociology },
    { name: 'Technical Maths', image: TechnicalMaths },
];

export default subjectTiles;
