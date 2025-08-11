import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { RefreshCcw } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getFirestore, QuerySnapshot } from "firebase/firestore";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: "mateohacks-practice.firebaseapp.com",
  projectId: "mateohacks-practice",
  storageBucket: "mateohacks-practice.firebasestorage.app",
  messagingSenderId: "22822135145",
  appId: "1:22822135145:web:934872e9570445e404c9f8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [round, setRound] = useState();

  const players = [
    "Anthony",
    "Adrian",
    "Jeremiah",
    "Markus",
    "Mateos",
    "Christan",
    "Jovia",
  ];

  const [playing, setPlaying] = useState([]);
  const [notPlaying, setNotPlaying] = useState([]);

  const fetchRound = () => {
    getDocs(collection(db, "round")).then((qs) =>
      qs.forEach((el) => {
        let i = el.data()["round"];
        setRound(i);

        const s = new Set([0, 1, 2, 3, 4, 5, 6]);

        const a = [];

        i = ((i - 1) % 7) * 2;

        for (let z = 0; z < 5; z++) {
          a.push(players[i % 7]);
          s.delete(i % 7);
          i += 1;
        }

        setPlaying(a);
        setNotPlaying([...s].map((idx) => players[idx]));
      })
    );
  };

  useEffect(() => {
    fetchRound();
  }, []);

  const updateRound = (type) => {
    getDocs(collection(db, "round")).then((qs) =>
      console.log(
        qs.forEach((el) => {
          let val = el.data()["round"];
          const roundRef = doc(db, "round", "round");
          if (type == "NEXT") val += 1;
          else if (type == "BACK") val -= 1;
          else val = 1;
          updateDoc(roundRef, { round: val }).then(fetchRound);
        })
      )
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-center font-playwrite">
        <div className="p-8"></div>
        <p className="text-6xl italic">Topgolf</p>
        <div className="p-4"></div>
        <p className="font-libertinus">Playing this round:</p>
        <div className="flex gap-2">
          <p className="text-4xl">Adrien,</p>
          {playing.map((player) => (
            <p className="text-3xl">{player},</p>
          ))}
        </div>
        <div className="p-1"></div>
        <p className="font-libertinus">Sitting out this round:</p>
        <div className="flex gap-2">
          {notPlaying.map((player) => (
            <p className="text-3xl">{player},</p>
          ))}
        </div>
        <div className="p-2"></div>
        <div className="flex gap-3 font-libertinus items-center">
          <p className="text-5xl">Round #{round}</p>
          <button
            onClick={() => updateRound("NEXT")}
            className="text-[#242424] bg-off-white rounded-xl p-2"
          >
            Next
          </button>
          <button
            onClick={() => updateRound("BACK")}
            className="border border-off-white rounded-xl p-2"
          >
            Back
          </button>
          <button
            onClick={() => updateRound("RESTART")}
            className="border border-off-white rounded-xl p-2"
          >
            Restart
          </button>
        </div>
        <div className="p-3"></div>
        <RefreshCcw
          size={60}
          strokeWidth={0.3}
          onClick={() => {
            window.location.reload();
          }}
        />
      </div>
    </>
  );
}

export default App;
