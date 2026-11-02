import React from 'react';
import { CASINO_SCENES, type CasinoSceneId } from './SceneTypes';
import { soundManager } from '../../audio/soundManager';
import { Landmark, Building2, Flame, ShieldAlert } from 'lucide-react';

interface SceneSelectorProps {
  currentSceneId: CasinoSceneId;
  onSelectScene: (sceneId: CasinoSceneId) => void;
  disabled?: boolean;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({
  currentSceneId,
  onSelectScene,
  disabled = false,
}) => {
  const getSceneIcon = (id: CasinoSceneId) => {
    switch (id) {
      case 'VAULT':
        return Landmark;
      case 'PENTHOUSE':
        return Building2;
      case 'MINT':
        return Flame;
      case 'HEIST':
        return ShieldAlert;
    }
  };

  const sceneKeys: CasinoSceneId[] = ['VAULT', 'PENTHOUSE', 'MINT', 'HEIST'];

  return (
    <div className="flex items-center space-x-1 sm:space-x-1.5 bg-casino-950/80 p-1 rounded-xl border border-white/10 shadow-inner flex-shrink-0">
      <span className="text-[8px] sm:text-[9px] uppercase font-black text-slate-400 pl-1 pr-0.5 tracking-wider hidden xs:inline">
        SCENE:
      </span>
      {sceneKeys.map((key) => {
        const scene = CASINO_SCENES[key];
        const Icon = getSceneIcon(key);
        const isActive = currentSceneId === key;

        return (
          <button
            key={key}
            onClick={() => {
              if (isActive || disabled) return;
              soundManager.playButtonClick();
              onSelectScene(key);
            }}
            disabled={disabled}
            title={`${scene.name}: ${scene.description}`}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider transition-all duration-200 flex-shrink-0 ${
              isActive
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 shadow-[0_0_12px_rgba(245,158,11,0.7)] border border-yellow-200 scale-105'
                : 'bg-casino-900/60 text-slate-400 hover:text-white hover:bg-casino-800 border border-white/5'
            }`}
          >
            <Icon className={`w-3 h-3 ${isActive ? 'text-amber-950 fill-amber-950' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{scene.name.split(' ')[0]}</span>
            <span className="sm:hidden">{key}</span>
          </button>
        );
      })}
    </div>
  );
};
