import logoipsuml from '../../../assets/home/logoipsuml.png';
import logoipsumd from '../../../assets/home/logoipsumd.png';
import frame from '../../../assets/home/Frame.png';
import framed from '../../../assets/home/Framed.png';
import frameb from '../../../assets/home/Frameblur.png';
import layer from '../../../assets/home/Layer_1.png';
import './LogoFrame.css';

const LogoFrame = () => {
    return (
        <div className='grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 gap-2 justify-items-center items-center div-with-white-shadow mt-4 mb-12'>
            <img src={logoipsuml} alt="logo" />
            <img src={frame} alt="logo" />
            <img src={framed} alt="logo" />
            <img src={logoipsumd} alt="logo" />
            <img src={layer} alt="logo" />
            <img src={frameb} alt="logo" />
        </div>
    );
};

export default LogoFrame;