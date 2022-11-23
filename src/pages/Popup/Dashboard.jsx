import { Magic } from 'magic-sdk';
// import secrets from '../../secrets/secrets.development';
export const magic = new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY);
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import Loading from './Loading';
import logo from '../../assets/img/dframe.png';
import { BsThreeDots } from "react-icons/bs";
import { IoChevronForwardOutline } from "react-icons/io5";
import wallet from '../../assets/img/account_balance_wallet.png';
import info from '../../assets/img/info.png';
import reward from '../../assets/img/payments.png';
import barChart from '../../assets/img/bar_chart.png';
import analytics from '../../assets/img/query_stats.png';
import permission from '../../assets/img/how_to_reg.png';
import { IoPersonSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [userMetadata, setUserMetadata] = useState();
    const history = useNavigate();
    const [nav, setNav] = useState(false);
    const stateChanger = () => {
        setNav(!nav);
    };
    const [on, setOn] = useState(false);
    const statesChanger = () => {
        setOn(!on)
    }
    const [state, setState] = React.useState({ status: true });

    // Change State Function
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };


    useEffect(() => {
        // On mount, we check if a user is logged in.
        // If so, we'll retrieve the authenticated user's profile.
        magic.user.isLoggedIn().then((magicIsLoggedIn) => {
            if (magicIsLoggedIn) {
                magic.user.getMetadata().then((result) => {
                    setUserMetadata(result)
                    // localStorage.setItem("user_cred", result)
                    chrome.storage.local.set({ "user_cred": result }, () => {
                        console.log("user_cred set in local")
                    })
                });
            } else {
                // If no user is logged in, redirect to `/login`
                history('/login');
            }
        });
    }, []);

    const logout = useCallback(() => {
        magic.user.logout().then(() => {
            history('/login');
        });
    }, [history]);

    return userMetadata ? (<div className='mcontainer'>
        <div className='flexbox'>
            <a href="https://dframe.org/" rel="noopener noreferrer" style={{ textDecoration: 'none' }} target="_blank" >
                <div className='lflex'>
                    <img src={logo} width="65" alt="logo" />
                    <h2 className='text' style={{ width: "80px" }}>D Frame</h2>
                </div>
            </a>
            <div onClick={statesChanger} style={{ padding: "8px" }} className='on'>
                {!on ? <p>ON</p> : <p>OFF</p>}
            </div>
            <div onClick={statesChanger} style={{
                margin: 'auto',
                display: 'block',
                width: 'fit-content',
            }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={state.status}
                            onChange={handleChange}
                            color="primary"
                            name="status"
                        />
                    }

                />
            </div>

            <div className='dots' onClick={stateChanger}>
                <BsThreeDots size={30} />
            </div>
        </div>
        <iframe width="95%" height="310" src="https://www.youtube.com/embed/YKaj1HUcYt0?controls=1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        <div className='icon'>
            {!nav ? "" :
                <div >
                    <div className='_icons'>
                        <div>
                            <a href="https://d-frame-user-dashboard.vercel.app/Profile" rel="noopener noreferrer" style={{ textDecoration: 'none' }} target="_blank">
                                <div className='icons' >
                                    <IoPersonSharp className="reactIcons" size={28} />
                                    <p className='reactText'>Profile</p>
                                    <IoChevronForwardOutline size={23} className='reactArrow' />
                                </div>
                            </a>
                        </div>

                        <div>
                            {/* <a href="https://d-frame-user-dashboard.vercel.app/Wallet" rel="noopener noreferrer" style={{ textDecoration: 'none' }} target="_blank">
                                <div className='icons'>
                                    <img src={wallet} alt="Wallet Icon" className="reactIcons" />
                                    <p className='reactText'>Wallet</p>
                                    <IoChevronForwardOutline size={23} className='reactArrow' />
                                </div>
                            </a> */}
                            <button onClick={() => chrome.tabs.create({ url: 'popup.html' })}>Wallet</button>
                        </div>

                        <div>
                            <a href="https://d-frame-user-dashboard.vercel.app/BrowserData" rel="noopener noreferrer" style={{ textDecoration: 'none' }} target="_blank">
                                <div className='icons'>
                                    <img src={barChart} alt="Bar Chart Icon" className="reactIcons" />
                                    <p className='reactText'>Data</p>
                                    <IoChevronForwardOutline size={23} className='reactArrow' />
                                </div>
                            </a>
                        </div>
                        <div>
                            <a href="https://d-frame-user-dashboard.vercel.app/Reward" rel="noopener noreferrer" style={{ textDecoration: 'none' }} target="_blank">
                                <div className='icons'>
                                    <img src={reward} alt="Payment Icon" className="reactIcons" />
                                    <p className='reactText'>Rewards</p>
                                    <IoChevronForwardOutline size={23} className='reactArrow' />
                                </div>
                            </a>
                        </div>
                        <div>
                            <a href="https://d-frame-user-dashboard.vercel.app/TopSiteVisited" rel="noopener noreferrer" style={{ textDecoration: 'none' }} target="_blank">
                                <div className='icons'>
                                    <img src={analytics} alt="Analytics Icon" className="reactIcons" />
                                    <p className='reactText'>Analytics</p>
                                    <IoChevronForwardOutline size={23} className='reactArrow' />
                                </div>
                            </a>
                        </div>
                        <div>
                            <a href="https://d-frame-user-dashboard.vercel.app/Permissions" rel="noopener noreferrer" style={{ textDecoration: 'none' }} target="_blank">
                                <div className='icons'>
                                    <img src={permission} alt="Permission Icon" className="reactIcons" />
                                    <p className='reactText'>Permissions</p>
                                    <IoChevronForwardOutline size={23} className='reactArrow' />
                                </div>
                            </a>
                        </div>
                        <div >
                            <a href="https://d-frame-user-dashboard.vercel.app/Help" rel="noopener noreferrer" style={{ textDecoration: 'none' }} target="_blank">
                                <div className='icons'>
                                    <img src={info} alt="Info Icon" className="reactIcons" />
                                    <p className='reactText'>Help</p>
                                    <IoChevronForwardOutline size={23} className='reactArrow' />
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className='earning'>
                        <p>D Frame Earnings :</p>
                        <h2>20 DFT</h2>
                    </div>
                </div>

            }
        </div>
        <div className='containers'>
            <p className='containersText1'>Current User: <span className='containersText'>{userMetadata.email}</span></p>

        </div>
        <div className='logdash'>
            <div>
                <button className='logout' onClick={logout}>Logout</button>
            </div>
            {/* <div> {!nav ? <a
                className="App-link"
                href="http://localhost:3001"
            //rel="noopener noreferrer"
            >
                Go to dashboard!
            </a> : ""}
            </div> */}
        </div>
    </div>
    ) : (
        <Loading />
    );
}