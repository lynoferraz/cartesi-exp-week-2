"use client"

import { Parser } from "expr-eval";
import { ethers } from "ethers";
import { useContext, useState, useEffect, useRef } from "react";
import { useConnectWallet } from '@web3-onboard/react';

import RestartIcon from '@mui/icons-material/RestartAlt';
import StopIcon from '@mui/icons-material/Stop';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import PauseIcon from '@mui/icons-material/Pause';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import FastForwardIcon from '@mui/icons-material/FastForward';
import { sha256 } from "js-sha256";
import { envClient } from "../utils/clientEnv";
import ErrorModal, { ERROR_FEEDBACK } from "./ErrorModal";
import { VerificationOutput, VerifyPayloadProxy, cartridge, getOutputs, rules } from "../backend-libs/core/lib";
import { DecodedIndexerOutput } from "../backend-libs/cartesapp/lib";
import { RuleInfo } from "../backend-libs/core/ifaces";
import { ContestStatus, formatBytes, getContestStatus, getContestStatusMessage } from "../utils/common";
import Image from "next/image";
import { byteToBase64 } from "../utils/common";
import rivesLogo from '../../public/rives64px.png';

enum STATUS {
    READY,
    VALID,
    INVALID,
}
  
interface FEEDBACK_STATUS {
    status:STATUS,
    message?:string
}
  
async function getScore(tapeId:string): Promise<VerificationOutput>{
    const res:DecodedIndexerOutput = await getOutputs(
      {
          tags: ["score"],
          type: 'notice',
          order_by: "timestamp",
          order_dir: "desc"
      },
      {cartesiNodeUrl: envClient.CARTESI_NODE_URL}
    );
    const verificationINputs:Array<VerificationOutput> = res.data;
  
    return verificationINputs[0];
}
  
async function getScreenshot(tapeId:string): Promise<String>{
    const res:DecodedIndexerOutput = await getOutputs(
      {
          tags: ["screenshot"],
          type: 'report',
          order_by: "timestamp",
          order_dir: "desc"
      },
      {cartesiNodeUrl: envClient.CARTESI_NODE_EXTENSION_URL}
    );
    const verificationINputs:Array<Uint8Array> = res.data;
  
    return byteToBase64(verificationINputs[0]);
}
  
function Nft(
    {rule_id, tape_id}:
    {rule_id?:string, tape_id?:string}) {

    const [{ wallet }] = useConnectWallet();
    const [score,setScore] = useState<VerificationOutput>();
    const [errorFeedback, setErrorFeedback] = useState<ERROR_FEEDBACK>();
  
  
    // const [nftContract,setNftContract] = useState<Contract>();
    const [gamelogOwner,setGamelogOwner] = useState<String>();
    const [operator,setOperator] = useState<String>();
    const [signerAddress,setSignerAddress] = useState<String>();
    const [alreadyMinted,setAlreadyMinted] = useState<boolean>(false);
    const [feedback, setFeedback] = useState({status: STATUS.READY} as FEEDBACK_STATUS);
    // const score: ReplayScore | undefined = await useMemo( async () => {
    //   const out = await getOutputs({tags: ["screenshot"],input_index: inputIndex}, {cartesiNodeUrl: envClient.CARTESI_NODE_URL})
    //   if (out.length == 0) return undefined;
    //   return out[0] as ReplayScore;
    // }, []);
  
    // useEffect(() => {
    //   if (!wallet) {
    //     setNftContract(undefined);
    //     return;
    //   }
    //   const curSigner = new ethers.providers.Web3Provider(wallet.provider, 'any').getSigner();
    //   const curContract = new ethers.Contract(envClient.NFT_ADDR,nftAbi.abi,curSigner);
    //   curContract.provider.getCode(curContract.address).then((code) => {
    //     if (code == '0x') {
    //         console.log("Couldn't get nft contract")
    //         return;
    //     }
    //     setNftContract(curContract);
    //     curSigner.getAddress().then((a: String) => setSignerAddress(a.toLowerCase()));
    //     curContract.operator().then((o: String) => setOperator(o.toLowerCase()));
    //     if (score != undefined && score.gameplay_hash != undefined) {
    //       curContract.gamelogOwner(score.gameplay_hash).then((o: String) => setGamelogOwner(o.toLowerCase()));
    //       if (score._proof != undefined)
    //         curContract.ckeckMinted(score._payload,score._proof).then((o: boolean) => {console.log("minted",o);setAlreadyMinted(o)});
    //     }
    //   });
    // },[wallet,score]);
  
    useEffect(() => {
        if (!tape_id) {
            const error:ERROR_FEEDBACK = {
                severity: "alert",
                message: "No Tape Id!",
                dismissible: true
            };
            setErrorFeedback(error);
            return;
        }
        getScoreFromBackend();
    },[]);

    const getScoreFromBackend = () => {
        if (!tape_id) return;

        getScore(tape_id).then((data) => {
            if (!data) {
                const error:ERROR_FEEDBACK = {
                    severity: "alert",
                    message: "No Tape Verification output!",
                    dismissible: true
                };
                setErrorFeedback(error);
                return;
            }
            setScore(data);
        });
    };
  
    if (errorFeedback) {
        return <ErrorModal error={errorFeedback} dissmissFunction={() => {setErrorFeedback(undefined)}} />;
    }

    if (tape_id == undefined) 
        return (
          <div className="flex flex-col items-center text-white">
            <span className={`text-1xl` }>No Tape id!</span>
          </div>
        );
    if (score == undefined)
        return (
          <div className="flex flex-col items-center text-white">
            <span className={`text-1xl` }>Gameplay not processed by the Cartesi Machine Backend (yet)!</span>
            <button className="btn mt-5 w-48" onClick={() => {getScoreFromBackend()}}>
              Reload Score
            </button>
          </div>
        );
    
    return (
        <div className="flex flex-col">
          <Screenshot tapeId={tape_id} />
          {/* <NftButtons signature={signature} score={score} nftContract={nftContract}
            gamelogOwner={gamelogOwner} operator={operator} signerAddress={signerAddress}
            alreadyMinted={alreadyMinted} reload={feedbackAndReload} /> */}
          </div>
    );
  };
  
  
//   const NftButtons = ({signature,score,nftContract,gamelogOwner,operator,signerAddress,alreadyMinted,reload}:
//     {signature:String|null,score:ReplayScore,nftContract:Contract|undefined,gamelogOwner:String|undefined,
//       operator:String|undefined,signerAddress:String|undefined,alreadyMinted:boolean|undefined,reload(s:String):void}) => {
  
//     const userAddress = score.user_address?.toLowerCase();
  
//     const mint = async () => {
//       if (score?._proof == undefined) {
//         alert("No proofs yet.");
//         return;
//       }
//       if (!nftContract) {
//         alert("Contract not loaded.");
//         return;
//       }
//       if (alreadyMinted) {
//         alert("Already Minted.");
//         return;
//       }
//       if (operator == userAddress && (!gamelogOwner || gamelogOwner == '0x0000000000000000000000000000000000000000')) {
//         alert("Operator generated (register first).");
//         return;
//       }
//       nftContract.mint(score._payload,score._proof).
//         then((res: any) => {
//           res.wait(1).then(
//             (receipt: any) => {
//               console.log(receipt)
//               reload("Nft Minted!");
//             }
//           );
//         }
//       );
//     };
  
//     const register = async () => {
//       if (!signature || signature.length != 132) {
//         alert("Invalid signature.");
//         return;
//       }
//       if (!nftContract) {
//         alert("Contract not loaded.");
//         return;
//       }
//       if (alreadyMinted) {
//         alert("Already Minted.");
//         return;
//       }
//       if (signerAddress == operator){
//         alert("Operator can't register.");
//         return;
//       }
//       if (gamelogOwner != '0x0000000000000000000000000000000000000000') {
//         alert("Already registered.");
//         return;
//       }
//       const r = signature.slice(0, 66);
//       const s = "0x" + signature.slice(66, 130);
//       const v = parseInt(signature.slice(130, 132), 16);
  
//       nftContract.setGameplayOwner(score.gameplay_hash,r,s,v).
//         then((res: any) => {
//           res.wait(1).then(
//             (receipt: any) => {
//               console.log(receipt)
//               reload("Gameplay Registered");
//             }
//           );
//         }
//       );
//     };
  
//     let mintEnabled = false;
//     let mintMessage = <></>;
//     if (score?._proof == undefined)
//       mintMessage = <span>(check again later, no proofs yet)</span>;
//     else if (!nftContract)
//       mintMessage = <span>(connect wallet)</span>;
//     else if (alreadyMinted)
//       mintMessage = <span>(already Minted)</span>;
//     else if (operator == userAddress && (!gamelogOwner || gamelogOwner == '0x0000000000000000000000000000000000000000'))
//       mintMessage = <span>(operator generated, register first)</span>;
//     else {
//       mintEnabled = true;
//       mintMessage = <span></span>;
//     }
  
//     const mintButton =
//       <button className="btn" onClick={() => {mint()}} disabled={!mintEnabled}>
//         <span>Mint Score Screenshot NFT</span><br/>
//         {mintMessage}
//       </button>
//     ;
  
//     let showRegister = false;
//     let registerEnabled = false;
//     let registerMessage = <></>;
//     if (!nftContract)
//       registerMessage = <span>(connect wallet)</span>;
//     else if (alreadyMinted)
//       mintMessage = <span>(already Minted)</span>;
//     else if (operator == userAddress) {
//       showRegister = true;
//       if (signerAddress == operator)
//         registerMessage = <span>(operator can&apos;t register)</span>;
//       else if (gamelogOwner != '0x0000000000000000000000000000000000000000')
//         registerMessage = <span>(already registered)</span>;
//       else if (!signature)
//         registerMessage = <span>(no signature)</span>;
//       else {
//         registerEnabled = true
//         registerMessage = <span></span>;
//       }
//     }
  
//     const registerButton = !showRegister ?
//       <></>
//       :
//       <button className="btn" onClick={() => {register()}} disabled={!registerEnabled}>
//         <span>Register Gameplay</span><br/>
//         {registerMessage}
//       </button>
//     ;
  
//     return (
//       <div className='flex flex-col space-y-1 mt-1 text-sm'>
//         {mintButton}
//         {registerButton}
//       </div>
//   );
//   }

  const Screenshot = ({tapeId}:{tapeId: string}) => {
    const [base64Image,setBase64Image] = useState<String>();
    useEffect(() => {
        if (tapeId == undefined) return;

        getScreenshot(tapeId).then((data) => {
            if (data) setBase64Image(data);
        });
      setBase64Image


    },[tapeId]);
  
    if (!base64Image) return (
    <div>
      <span className={` text-1m text-white` }>Nothing to show here!</span>
    </div>
    );
  
    return (
        <Image alt={"screenshot " + tapeId}
        height={512} width={1200}
        id={"screenshot-" + tapeId}
        src={base64Image ? `data:image/png;base64,${base64Image}`:"/logo.png"}
        style={{
            maxHeight: 512,
            height: '100%',
            width: 'auto'
        }}
        />
    );
  };
export default Nft;