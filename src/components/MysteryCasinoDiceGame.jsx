import React, { useState, useEffect, useRef } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Settings, Volume2, VolumeX } from 'lucide-react';

const MysteryCasinoDiceGame = () => {
  // State
  const [playerName, setPlayerName] = useState('Player 1');
  const [playerDice, setPlayerDice] = useState(1);
  const [computerDice, setComputerDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [draws, setDraws] = useState(0);
  const [language, setLanguage] = useState('en');
  const [showSettings, setShowSettings] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [newName, setNewName] = useState('');
  const [gameHistory, setGameHistory] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(null);
  const diceAudioRef = useRef(null);
  const winAudioRef = useRef(null);

  // Translations
  const translations = {
    en: {
      title: 'MYSTERY CASINO',
      subtitle: 'EXCLUSIVE DICE GAME',
      player: 'Player',
      dealer: 'Dealer',
      draw: 'Draw',
      roll: 'ROLL DICE',
      rolling: 'ROLLING...',
      won: 'WON!',
      history: 'Recent Games',
      changeName: 'Change',
      settings: 'Settings',
      language: 'Language',
      theme: 'Theme',
      goodLuck: 'FORTUNE FAVORS THE BOLD',
      newName: 'New username',
      vs: 'VS',
      sound: 'Sound'
    },
    tr: {
      title: 'GİZEMLİ CASINO',
      subtitle: 'ÖZEL ZAR OYUNU',
      player: 'Oyuncu',
      dealer: 'Krupiye',
      draw: 'Berabere',
      roll: 'ZAR AT',
      rolling: 'ATILIYOR...',
      won: 'KAZANDI!',
      history: 'Son Oyunlar',
      changeName: 'Değiştir',
      settings: 'Ayarlar',
      language: 'Dil',
      theme: 'Tema',
      goodLuck: 'ŞANS CESURDANDİR',
      newName: 'Yeni kullanıcı adı',
      vs: 'VS',
      sound: 'Ses'
    },
    de: {
      title: 'MYSTISCHES CASINO',
      subtitle: 'EXKLUSIVES WÜRFELSPIEL',
      player: 'Spieler',
      dealer: 'Dealer',
      draw: 'Unentschieden',
      roll: 'WÜRFELN',
      rolling: 'WÜRFELT...',
      won: 'GEWONNEN!',
      history: 'Letzte Spiele',
      changeName: 'Ändern',
      settings: 'Einstellungen',
      language: 'Sprache',
      theme: 'Thema',
      goodLuck: 'DAS GLÜCK BEGÜNSTIGT DIE MUTIGEN',
      newName: 'Neuer Benutzername',
      vs: 'VS',
      sound: 'Ton'
    }
  };

  // Get current translation
  const t = translations[language];

  // Load fonts and audio
  useEffect(() => {
    // Load soft, elegant fonts
    const fontLink1 = document.createElement('link');
    fontLink1.rel = 'stylesheet';
    fontLink1.href = 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600&display=swap';
    document.head.appendChild(fontLink1);

    const fontLink2 = document.createElement('link');
    fontLink2.rel = 'stylesheet';
    fontLink2.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap';
    document.head.appendChild(fontLink2);
    
    // Casino ambient sound
    const ambientAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d4d2.mp3');
    ambientAudio.loop = true;
    ambientAudio.volume = 0.4;
    audioRef.current = ambientAudio;

    // Dice rolling sound
    const diceAudio = new Audio('https://cdn.pixabay.com/download/audio/2021/08/09/audio_cb1d3b142c.mp3');
    diceAudio.volume = 0.7;
    diceAudioRef.current = diceAudio;

    // Win sound
    const winAudio = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_c518b3bfe3.mp3');
    winAudio.volume = 0.6;
    winAudioRef.current = winAudio;

    // Auto-play ambient sound (if not muted)
    if (!isMuted) {
      ambientAudio.play().catch(e => console.log("Auto-play prevented: ", e));
    }
    
    return () => {
      // Cleanup
      document.head.removeChild(fontLink1);
      document.head.removeChild(fontLink2);
      if (audioRef.current) audioRef.current.pause();
      if (diceAudioRef.current) diceAudioRef.current.pause();
      if (winAudioRef.current) winAudioRef.current.pause();
    };
  }, []);

  // Handle sound toggle
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Playback prevented: ", e));
      }
    }
  }, [isMuted]);

  // Roll dice function
  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setResult('');
    
    // Play dice sound
    if (!isMuted && diceAudioRef.current) {
      diceAudioRef.current.currentTime = 0;
      diceAudioRef.current.play().catch(e => console.log("Playback prevented: ", e));
    }
    
    // Animation
    const rollInterval = setInterval(() => {
      setPlayerDice(Math.floor(Math.random() * 6) + 1);
      setComputerDice(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    // End roll after 2 seconds
    setTimeout(() => {
      clearInterval(rollInterval);
      
      const finalPlayerDice = Math.floor(Math.random() * 6) + 1;
      const finalComputerDice = Math.floor(Math.random() * 6) + 1;
      
      setPlayerDice(finalPlayerDice);
      setComputerDice(finalComputerDice);
      
      // Determine winner
      let resultType = '';
      if (finalPlayerDice > finalComputerDice) {
        setPlayerScore(s => s + 1);
        setResult(`${playerName} ${t.won}`);
        resultType = 'player';
        // Play win sound
        if (!isMuted && winAudioRef.current) {
          winAudioRef.current.currentTime = 0;
          winAudioRef.current.play().catch(e => console.log("Playback prevented: ", e));
        }
      } else if (finalComputerDice > finalPlayerDice) {
        setComputerScore(s => s + 1);
        setResult(`${t.dealer} ${t.won}`);
        resultType = 'dealer';
      } else {
        setDraws(d => d + 1);
        setResult(t.draw);
        resultType = 'draw';
      }
      
      // Add to history
      setGameHistory(prev => [{
        id: Date.now(),
        playerDice: finalPlayerDice,
        computerDice: finalComputerDice,
        result: resultType
      }, ...prev].slice(0, 5));
      
      setIsRolling(false);
    }, 2000);
  };

  // Update player name
  const updateName = () => {
    if (newName.trim()) {
      setPlayerName(newName);
      setShowNameEdit(false);
      setNewName('');
    }
  };

  // Render dice component
  const renderDice = (value) => {
    const props = { size: 72, className: "text-gray-800" };
    
    switch (value) {
      case 1: return <Dice1 {...props} />;
      case 2: return <Dice2 {...props} />;
      case 3: return <Dice3 {...props} />;
      case 4: return <Dice4 {...props} />;
      case 5: return <Dice5 {...props} />;
      case 6: return <Dice6 {...props} />;
      default: return <Dice1 {...props} />;
    }
  };

  // Get result color
  const getResultColor = () => {
    if (result.includes(t.won)) {
      return result.includes(playerName) ? 'text-red-400' : 'text-gray-400';
    }
    return 'text-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 flex items-center justify-center"
         style={{ fontFamily: "'Raleway', sans-serif" }}>
      
      {/* Background pattern */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIvPjwvZz48L3N2Zz4=')" }}></div>
      </div>
      
      {/* Audio Controls */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-4 right-4 bg-gray-800/70 backdrop-blur-sm p-2 rounded-full z-50 hover:bg-gray-700/70 transition-colors"
      >
        {isMuted ? 
          <VolumeX size={20} className="text-red-400/70" /> : 
          <Volume2 size={20} className="text-red-400/70" />
        }
      </button>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light text-red-400">{t.settings}</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800">
                ✕
              </button>
            </div>
            
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">{t.language}</h3>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setLanguage('en')} 
                  className={`p-3 rounded border ${language === 'en' ? 'border-red-700 bg-red-900/20 text-red-300' : 'border-gray-700 text-gray-300'} hover:border-red-700/50 transition-colors`}
                >
                  English
                </button>
                <button 
                  onClick={() => setLanguage('tr')} 
                  className={`p-3 rounded border ${language === 'tr' ? 'border-red-700 bg-red-900/20 text-red-300' : 'border-gray-700 text-gray-300'} hover:border-red-700/50 transition-colors`}
                >
                  Türkçe
                </button>
                <button 
                  onClick={() => setLanguage('de')} 
                  className={`p-3 rounded border ${language === 'de' ? 'border-red-700 bg-red-900/20 text-red-300' : 'border-gray-700 text-gray-300'} hover:border-red-700/50 transition-colors`}
                >
                  Deutsch
                </button>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">{t.sound}</h3>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-full p-3 rounded border flex items-center justify-center gap-3 ${isMuted ? 'border-gray-700 text-gray-400' : 'border-red-700 bg-red-900/20 text-red-300'} hover:border-red-700/50 transition-colors`}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                {isMuted ? 'Muted' : 'On'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Game Container */}
      <div className="w-full max-w-4xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 z-10">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-center relative border-b border-red-900/30">
          <button 
            onClick={() => setShowSettings(true)}
            className="absolute right-6 top-6 p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <Settings size={22} className="text-red-400/80" />
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-700/50 to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-red-700"></div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-700/50 to-transparent"></div>
          </div>
          
          <h1 className="text-4xl text-red-500 mb-2 font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t.title}
          </h1>
          <p className="text-gray-400 tracking-widest text-sm uppercase font-light">{t.subtitle}</p>
        </div>
        
        {/* Game Content */}
        <div className="p-8 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
          {/* Score Board */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-red-400 font-medium">{playerName}</span>
                <button 
                  onClick={() => setShowNameEdit(!showNameEdit)} 
                  className="text-xs bg-gray-800 hover:bg-gray-700 rounded-full px-2 py-1 text-gray-400"
                >
                  ✎
                </button>
              </div>
              <div className="text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{playerScore}</div>
            </div>
            
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700">
              <div className="text-gray-300 font-medium mb-3">{t.draw}</div>
              <div className="text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{draws}</div>
            </div>
            
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700">
              <div className="text-gray-300 font-medium mb-3">{t.dealer}</div>
              <div className="text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{computerScore}</div>
            </div>
          </div>
          
          {/* Name Edit */}
          {showNameEdit && (
            <div className="mb-8 p-4 bg-gray-900/60 backdrop-blur-sm rounded-lg flex border border-gray-700">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && updateName()}
                placeholder={t.newName}
                className="flex-1 bg-gray-800 text-white p-3 rounded-l-lg outline-none border-0 focus:ring-1 focus:ring-red-700/50"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              />
              <button 
                onClick={updateName}
                className="bg-gradient-to-r from-red-900 to-red-800 px-6 py-3 text-white font-medium rounded-r-lg hover:from-red-800 hover:to-red-700 transition-colors"
              >
                {t.changeName}
              </button>
            </div>
          )}
          
          {/* Dice Area */}
          <div className="flex justify-center items-center gap-10 mb-10">
            <div className="text-center">
              <div className="mb-3 text-lg font-light tracking-wide text-gray-300">{playerName}</div>
              <div className="bg-gradient-to-br from-gray-100 to-white w-32 h-32 rounded-lg flex items-center justify-center shadow-xl shadow-black/50 border border-gray-300/20 transform transition-all duration-300 hover:rotate-3">
                {renderDice(playerDice)}
              </div>
            </div>
            
            <div className="text-red-400 text-4xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.vs}
            </div>
            
            <div className="text-center">
              <div className="mb-3 text-lg font-light tracking-wide text-gray-300">{t.dealer}</div>
              <div className="bg-gradient-to-br from-gray-100 to-white w-32 h-32 rounded-lg flex items-center justify-center shadow-xl shadow-black/50 border border-gray-300/20 transform transition-all duration-300 hover:rotate-3">
                {renderDice(computerDice)}
              </div>
            </div>
          </div>
          
          {/* Result Message */}
          {result && (
            <div className={`text-center ${getResultColor()} text-3xl font-light mb-8`} style={{ fontFamily: "'Playfair Display', serif" }}>
              {result}
            </div>
          )}
          
          {/* Roll Button */}
          <div className="text-center mb-12">
            <button
              onClick={rollDice}
              disabled={isRolling}
              className="py-4 px-12 rounded-lg font-medium text-white bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg shadow-black/30 tracking-wide"
            >
              {isRolling ? t.rolling : t.roll}
            </button>
          </div>
          
          {/* Game History */}
          {gameHistory.length > 0 && (
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h3 className="text-red-400 font-medium mb-4 uppercase tracking-wider text-sm">{t.history}</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {gameHistory.map(game => (
                  <div key={game.id} className="flex justify-between items-center p-3 bg-gray-800/80 rounded-lg border-l-4 border-gray-700 hover:border-l-red-700 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300">{playerName}: <span className="text-white font-medium">{game.playerDice}</span></span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-300">{t.dealer}: <span className="text-white font-medium">{game.computerDice}</span></span>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      game.result === 'player' ? 'bg-red-900/30 text-red-300 border border-red-800/30' : 
                      game.result === 'dealer' ? 'bg-gray-700/50 text-gray-300 border border-gray-600/30' : 
                      'bg-gray-700/30 text-gray-300 border border-gray-600/30'
                    }`}>
                      {game.result === 'player' ? playerName : 
                       game.result === 'dealer' ? t.dealer : 
                       t.draw}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-5 bg-black text-center border-t border-red-900/20">
          <p className="text-gray-500 text-sm tracking-wide font-light">{t.goodLuck}</p>
        </div>
      </div>
    </div>
  );
};

export default MysteryCasinoDiceGame;