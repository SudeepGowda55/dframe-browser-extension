import { Magic } from 'magic-sdk';
// import secrets from '../../secrets/secrets.development';
export const magic = new Magic('pk_live_C978F3A837C4396C');
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import Loading from './Loading';
import logo from '../../assets/img/dframe.png';
import { BsThreeDots } from 'react-icons/bs';
import { IoChevronForwardOutline } from 'react-icons/io5';
import wallet from '../../assets/img/account_balance_wallet.png';
import info from '../../assets/img/info.png';
import reward from '../../assets/img/payments.png';
import barChart from '../../assets/img/bar_chart.png';
import analytics from '../../assets/img/query_stats.png';
import permission from '../../assets/img/how_to_reg.png';
import { IoPersonSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Web3 from 'web3';

export default function Dashboard() {
  const [userAddress, setUserAddress] = useState(null);
  const [userMetadata, setUserMetadata] = useState({
    email: 'ayaangames@gmail.com',
  });
  const history = useNavigate();
  const [nav, setNav] = useState(false);
  const stateChanger = () => {
    setNav(!nav);
  };
  const [on, setOn] = useState(false);
  const statesChanger = () => {
    setOn(!on);
  };
  const [state, setState] = React.useState({ status: true });

  // Change State Function
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [walletBalance, setWalletBalance] = useState(null);
  const [fetch, setFetch] = useState(false);

  async function getBalance() {
    const web3 = new Web3(
      'https://polygon-mainnet.g.alchemy.com/v2/Ygfvgz118Xr9j6j_F3ZIMFye6SNTgJr8'
    );
    // set the contract address of the DFT token
    const dframeAddress = '0x0B6163c61D095b023EC3b52Cc77a9099f6231FCC';

    // set the ABI for the DFT token contract
    const dframeABI = [
      { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'previousOwner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'newOwner',
            type: 'address',
          },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        name: 'Snapshot',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'address', name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'account', type: 'address' },
          { internalType: 'uint256', name: 'snapshotId', type: 'uint256' },
        ],
        name: 'balanceOfAt',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'account', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'burnFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          {
            internalType: 'uint256',
            name: 'subtractedValue',
            type: 'uint256',
          },
        ],
        name: 'decreaseAllowance',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
        ],
        name: 'increaseAllowance',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'snapshot',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'snapshotId', type: 'uint256' },
        ],
        name: 'totalSupplyAt',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];

    // get the DFT token contract instance
    const dframeContract = new web3.eth.Contract(dframeABI, dframeAddress);
    //  get the balance of DFRAME tokens for the specified wallet address
    const balance = await dframeContract.methods
      .balanceOf(userAddress)
      // .balanceOf('0x659664dd23937edee4f19391A5C355FdbD4c93e6')
      .call();
    setFetch(true);
    const balanceInEth = web3.utils.fromWei(balance, 'ether');
    const balanceInKFormat = Math.trunc(balanceInEth / 1000).toString() + 'k';
    setWalletBalance(balanceInKFormat);
    console.log(walletBalance);
    console.log('userBalance', userBalance);
  }

  // useEffect(() => {
  //   getBalance();
  // }, [fetch]);
  useEffect(() => {
    getBalance();
  }, [userAddress]);
  useEffect(() => {
    // Get the userAddress from chrome.storage.sync
    chrome.storage.sync.get(['userAddress'], (result) => {
      if (result.userAddress) {
        setUserAddress(result.userAddress);
      }
    });
  }, []);

  // useEffect(() => {
  //   async function fetchWalletAddress() {
  //     if (window.ethereum) {
  //       // Use Metamask provider
  //       const web3 = new Web3(window.ethereum);

  //       try {
  //         // Request access to the user's accounts
  //         await window.ethereum.request({ method: 'eth_requestAccounts' });

  //         // Get the current wallet address
  //         const accounts = await web3.eth.getAccounts();

  //         // Update state with the wallet address
  //         setWalletAddress(accounts[0]);
  //         console.log(accounts[0]);
  //       } catch (error) {
  //         console.error('Error fetching wallet address:', error);
  //       }
  //     } else {
  //       console.log('Metamask not connected');
  //     }
  //   }

  //   console.log('Use effect running');
  // useEffect(() => {
  //   async function connectToMetaMask() {
  //     const web3 = new Web3(Web3.givenProvider);

  //     // Set the web3 instance in the state
  //     console.log('WEB3 EXTENSION', web3);
  //   }
  //   console.log('Use effect running');
  //   connectToMetaMask();
  // }, []);
  //   fetchWalletAddress();
  // }, []);

  // useEffect(() => {
  //   // On mount, we check if a user is logged in.
  //   // If so, we'll retrieve the authenticated user's profile.
  //   magic.user.isLoggedIn().then((magicIsLoggedIn) => {
  //     if (magicIsLoggedIn) {
  //       magic.user.getMetadata().then((result) => {
  //         setUserMetadata(result);
  //         // localStorage.setItem("user_cred", result)
  //         chrome.storage.local.set({ user_cred: result }, () => {
  //           console.log('user_cred set in local');
  //         });
  //       });
  //     } else {
  //       // If no user is logged in, redirect to `/login`
  //       history('/login');
  //     }
  //   });
  // }, []);

  // const logout = useCallback(() => {
  //   magic.user.logout().then(() => {
  //     history('/login');
  //   });
  // }, [history]);
  // useEffect(() => {
  //   const token = localStorage.getItem('userToken');
  //   if (!token) {
  //     history('/login');
  //   }
  // }, []);
  // Inside your dashboard.jsx file
  // useEffect(() => {
  //   // Inside your dashboard.jsx file
  //   window.addEventListener('message', (event) => {
  //     // Check if the message is from a trusted source (optional)
  //     if (event.source !== window) {
  //       return;
  //     }

  //     const message = event.data;

  //     // Check the message type
  //     if (message.type === 'addressFetched') {
  //       const userAddress = message.address;
  //       console.log('FETched address');

  //       // Now you have the user's address, you can fetch the balance of the DFRAME token
  //       // Call the function to fetch balance here using userAddress
  //       getBalance(userAddress);
  //     }
  //   });
  // }, []); // Empty dependency array to run once when the component mounts

  return (
    <div className="mcontainer">
      <div className="flexbox">
        <a
          href="https://dframe.org/"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
          target="_blank"
        >
          <div className="lflex">
            <img src={logo} width="65" alt="logo" />
            <h2 className="text" style={{ width: '80px' }}>
              D Frame
            </h2>
          </div>
        </a>
        <div onClick={statesChanger} style={{ padding: '8px' }} className="on">
          {!on ? <p>ON</p> : <p>OFF</p>}
        </div>
        <div
          onClick={statesChanger}
          style={{
            margin: 'auto',
            display: 'block',
            width: 'fit-content',
          }}
        >
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

        <div className="dots" onClick={stateChanger}>
          <BsThreeDots size={30} />
        </div>
      </div>
      <iframe
        width="95%"
        height="310"
        src="https://www.youtube.com/embed/YKaj1HUcYt0?controls=1"
        title="YouTube video player"
        // frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className="icon">
        {!nav ? (
          ''
        ) : (
          <div>
            <div className="_icons">
              <div>
                <a
                  href="http://localhost:3001/Profile"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  <div className="icons">
                    <IoPersonSharp className="reactIcons" size={28} />
                    <p className="reactText">Profile</p>
                    <IoChevronForwardOutline size={23} className="reactArrow" />
                  </div>
                </a>
              </div>

              <div>
                {/* <a href="http://localhost:3001/Wallet" rel="noopener noreferrer" style={{ textDecoration: 'none' }} target="_blank">
                                <div className='icons'>
                                    <img src={wallet} alt="Wallet Icon" className="reactIcons" />
                                    <p className='reactText'>Wallet</p>
                                    <IoChevronForwardOutline size={23} className='reactArrow' />
                                </div>
                            </a>
                            {/*<button onClick={() => chrome.tabs.create({ url: 'newtab.html' })}>Dashboard</button>*/}
              </div>

              <div>
                <a
                  href="http://localhost:3001/BrowserData"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  <div className="icons">
                    <img
                      src={barChart}
                      alt="Bar Chart Icon"
                      className="reactIcons"
                    />
                    <p className="reactText">Data</p>
                    <IoChevronForwardOutline size={23} className="reactArrow" />
                  </div>
                </a>
              </div>
              <div>
                <a
                  href="http://localhost:3001/Reward"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  <div className="icons">
                    <img
                      src={reward}
                      alt="Payment Icon"
                      className="reactIcons"
                    />
                    <p className="reactText">Rewards</p>
                    <IoChevronForwardOutline size={23} className="reactArrow" />
                  </div>
                </a>
              </div>
              <div>
                <a
                  href="http://localhost:3001/TopSiteVisited"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  <div className="icons">
                    <img
                      src={analytics}
                      alt="Analytics Icon"
                      className="reactIcons"
                    />
                    <p className="reactText">Analytics</p>
                    <IoChevronForwardOutline size={23} className="reactArrow" />
                  </div>
                </a>
              </div>
              <div>
                <a
                  href="http://localhost:3001/Permissions"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  <div className="icons">
                    <img
                      src={permission}
                      alt="Permission Icon"
                      className="reactIcons"
                    />
                    <p className="reactText">Permissions</p>
                    <IoChevronForwardOutline size={23} className="reactArrow" />
                  </div>
                </a>
              </div>
              <div>
                <a
                  href="http://localhost:3001/Help"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  <div className="icons">
                    <img src={info} alt="Info Icon" className="reactIcons" />
                    <p className="reactText">Help</p>
                    <IoChevronForwardOutline size={23} className="reactArrow" />
                  </div>
                </a>
              </div>
            </div>
            <div className="earning">
              <p>D Frame Earnings :</p>
              <h2>
                {walletBalance ? walletBalance : `N.A. - Login to dashboard`}
              </h2>
            </div>
          </div>
        )}
      </div>
      <div className="containers">
        <p className="containersText1">
          Current User:{' '}
          <span className="containersText">{userMetadata.email}</span>
        </p>
      </div>
      <div className="logdash">
        <div>
          <button className="logout" onClick={console.log('logout')}>
            Logout
          </button>
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
  );
}
