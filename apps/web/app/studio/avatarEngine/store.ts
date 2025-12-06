import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// OMNI-AVATAR ENGINE - STATE MANAGEMENT
// ============================================

export type AvatarStyle = 'realistic' | 'stylized' | 'anime' | 'cartoon' | 'animal';
export type Gender = 'male' | 'female' | 'neutral';
export type AnimalType = 'dog' | 'cat' | 'wolf' | 'fox' | 'custom';

// Body Morphs
export interface BodyMorphs {
  height: number;        // 0-100 → maps to 4'8" - 7'2"
  weight: number;        // 0-100 → maps to 90lbs - 400lbs
  muscleDefinition: number;
  fatDistribution: number;
  shoulderWidth: number;
  hipWidth: number;
  armLength: number;
  legLength: number;
  neckLength: number;
  torsoLength: number;
}

// Face Morphs
export interface FaceMorphs {
  faceWidth: number;
  faceLength: number;
  jawWidth: number;
  jawHeight: number;
  chinWidth: number;
  chinLength: number;
  cheekboneHeight: number;
  cheekboneWidth: number;
  eyeSize: number;
  eyeSpacing: number;
  eyeHeight: number;
  eyeTilt: number;
  noseWidth: number;
  noseLength: number;
  noseBridge: number;
  nostrilSize: number;
  lipWidth: number;
  lipFullnessUpper: number;
  lipFullnessLower: number;
  earSize: number;
  earAngle: number;
  browHeight: number;
  browThickness: number;
  foreheadHeight: number;
  foreheadWidth: number;
}

// Hair Config
export interface HairConfig {
  style: string;
  color: string;
  secondaryColor: string;
  length: number;
  volume: number;
  texture: 'straight' | 'wavy' | 'curly' | 'coily' | 'locs' | 'braids';
}

// Facial Hair Config
export interface FacialHairConfig {
  style: string;
  color: string;
  density: number;
  length: number;
}

// Clothing Config
export interface ClothingConfig {
  top: {
    style: string;
    primaryColor: string;
    secondaryColor: string;
    material: string;
  };
  bottom: {
    style: string;
    primaryColor: string;
    secondaryColor: string;
    material: string;
  };
  shoes: {
    style: string;
    primaryColor: string;
    secondaryColor: string;
  };
  outerwear: {
    style: string;
    primaryColor: string;
    secondaryColor: string;
  } | null;
}

// Accessories
export interface AccessoriesConfig {
  glasses: string | null;
  hat: string | null;
  earrings: string | null;
  necklace: string | null;
  watch: string | null;
  rings: string[];
  other: string[];
}

// Animal Morphs
export interface AnimalMorphs {
  type: AnimalType;
  breed: string;
  size: number;
  earSize: number;
  earPosition: number;
  snoutLength: number;
  tailLength: number;
  tailCurl: number;
  legLength: number;
  bodyLength: number;
  furLength: number;
  furColor: string;
  furPattern: string;
  eyeColor: string;
}

// Skin/Material Config
export interface SkinConfig {
  tone: string;
  undertone: 'warm' | 'neutral' | 'cool';
  freckles: number;
  blemishes: number;
  wrinkles: number;
  scars: string[];
  tattoos: string[];
  makeup: {
    foundation: number;
    eyeshadow: string | null;
    lipstick: string | null;
    blush: number;
    eyeliner: number;
  };
}

// Animation State
export interface AnimationState {
  currentAnimation: string;
  animationSpeed: number;
  isPlaying: boolean;
  availableAnimations: string[];
}

// Face Scan Data
export interface FaceScanData {
  landmarks: number[][] | null;
  textureUrl: string | null;
  meshUrl: string | null;
  confidence: number;
}

// Complete Avatar State
export interface AvatarState {
  // Meta
  id: string;
  name: string;
  style: AvatarStyle;
  gender: Gender;
  createdAt: string;
  updatedAt: string;

  // Human Morphs
  body: BodyMorphs;
  face: FaceMorphs;
  skin: SkinConfig;
  hair: HairConfig;
  facialHair: FacialHairConfig;
  clothing: ClothingConfig;
  accessories: AccessoriesConfig;

  // Animal (if style === 'animal')
  animal: AnimalMorphs | null;

  // Face Scan
  faceScan: FaceScanData | null;

  // Animation
  animation: AnimationState;

  // Loaded Assets
  loadedModelUrl: string | null;
  customMeshUrl: string | null;
}

// Default Values
export const defaultBodyMorphs: BodyMorphs = {
  height: 50,
  weight: 50,
  muscleDefinition: 50,
  fatDistribution: 50,
  shoulderWidth: 50,
  hipWidth: 50,
  armLength: 50,
  legLength: 50,
  neckLength: 50,
  torsoLength: 50,
};

export const defaultFaceMorphs: FaceMorphs = {
  faceWidth: 50,
  faceLength: 50,
  jawWidth: 50,
  jawHeight: 50,
  chinWidth: 50,
  chinLength: 50,
  cheekboneHeight: 50,
  cheekboneWidth: 50,
  eyeSize: 50,
  eyeSpacing: 50,
  eyeHeight: 50,
  eyeTilt: 50,
  noseWidth: 50,
  noseLength: 50,
  noseBridge: 50,
  nostrilSize: 50,
  lipWidth: 50,
  lipFullnessUpper: 50,
  lipFullnessLower: 50,
  earSize: 50,
  earAngle: 50,
  browHeight: 50,
  browThickness: 50,
  foreheadHeight: 50,
  foreheadWidth: 50,
};

export const defaultSkinConfig: SkinConfig = {
  tone: '#8D5524',
  undertone: 'warm',
  freckles: 0,
  blemishes: 0,
  wrinkles: 0,
  scars: [],
  tattoos: [],
  makeup: {
    foundation: 0,
    eyeshadow: null,
    lipstick: null,
    blush: 0,
    eyeliner: 0,
  },
};

export const defaultHairConfig: HairConfig = {
  style: 'fade',
  color: '#1a1a1a',
  secondaryColor: '#1a1a1a',
  length: 30,
  volume: 50,
  texture: 'coily',
};

export const defaultFacialHairConfig: FacialHairConfig = {
  style: 'goatee',
  color: '#1a1a1a',
  density: 70,
  length: 30,
};

export const defaultClothingConfig: ClothingConfig = {
  top: { style: 'blazer', primaryColor: '#1e3a5f', secondaryColor: '#ffffff', material: 'cotton' },
  bottom: { style: 'dress_pants', primaryColor: '#1a1a1a', secondaryColor: '#1a1a1a', material: 'wool' },
  shoes: { style: 'oxford', primaryColor: '#2d1f1a', secondaryColor: '#1a1a1a' },
  outerwear: null,
};

export const defaultAccessoriesConfig: AccessoriesConfig = {
  glasses: 'reading',
  hat: null,
  earrings: null,
  necklace: null,
  watch: 'silver',
  rings: [],
  other: [],
};

export const defaultAnimalMorphs: AnimalMorphs = {
  type: 'dog',
  breed: 'chihuahua',
  size: 20,
  earSize: 80,
  earPosition: 70,
  snoutLength: 30,
  tailLength: 50,
  tailCurl: 60,
  legLength: 30,
  bodyLength: 40,
  furLength: 20,
  furColor: '#d4a574',
  furPattern: 'solid',
  eyeColor: '#3d2314',
};

export const defaultAnimationState: AnimationState = {
  currentAnimation: 'idle',
  animationSpeed: 1,
  isPlaying: true,
  availableAnimations: ['idle', 'walk', 'run', 'wave', 'talk', 'sit'],
};

// Create default avatar
export const createDefaultAvatar = (): AvatarState => ({
  id: `avatar_${Date.now()}`,
  name: 'New Avatar',
  style: 'realistic',
  gender: 'male',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  body: { ...defaultBodyMorphs },
  face: { ...defaultFaceMorphs },
  skin: { ...defaultSkinConfig },
  hair: { ...defaultHairConfig },
  facialHair: { ...defaultFacialHairConfig },
  clothing: { ...defaultClothingConfig },
  accessories: { ...defaultAccessoriesConfig },
  animal: null,
  faceScan: null,
  animation: { ...defaultAnimationState },
  loadedModelUrl: null,
  customMeshUrl: null,
});

// UI State
export interface UIState {
  activeTab: 'body' | 'face' | 'hair' | 'clothing' | 'accessories' | 'animals' | 'facescan' | 'export';
  isLoading: boolean;
  isSaving: boolean;
  showExportModal: boolean;
  showLoadModal: boolean;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  viewMode: 'full' | 'head' | 'upper' | 'lower';
  showWireframe: boolean;
  showSkeleton: boolean;
  autoRotate: boolean;
}

// Store Interface
interface AvatarStore {
  // Current Avatar
  avatar: AvatarState;
  
  // Saved Avatars
  savedAvatars: AvatarState[];
  
  // UI State
  ui: UIState;
  
  // Actions - Avatar
  setAvatar: (avatar: AvatarState) => void;
  updateBody: (key: keyof BodyMorphs, value: number) => void;
  updateFace: (key: keyof FaceMorphs, value: number) => void;
  updateSkin: (updates: Partial<SkinConfig>) => void;
  updateHair: (updates: Partial<HairConfig>) => void;
  updateFacialHair: (updates: Partial<FacialHairConfig>) => void;
  updateClothing: (category: keyof ClothingConfig, updates: any) => void;
  updateAccessories: (updates: Partial<AccessoriesConfig>) => void;
  updateAnimal: (updates: Partial<AnimalMorphs>) => void;
  setStyle: (style: AvatarStyle) => void;
  setGender: (gender: Gender) => void;
  setName: (name: string) => void;
  setFaceScan: (data: FaceScanData | null) => void;
  resetAvatar: () => void;
  
  // Actions - Saved Avatars
  saveAvatar: () => void;
  loadAvatar: (id: string) => void;
  deleteAvatar: (id: string) => void;
  
  // Actions - UI
  setActiveTab: (tab: UIState['activeTab']) => void;
  setLoading: (loading: boolean) => void;
  setViewMode: (mode: UIState['viewMode']) => void;
  toggleWireframe: () => void;
  toggleSkeleton: () => void;
  toggleAutoRotate: () => void;
  setCameraPosition: (pos: [number, number, number]) => void;
  setShowExportModal: (show: boolean) => void;
  setShowLoadModal: (show: boolean) => void;
}

// Create Store
export const useAvatarStore = create<AvatarStore>()(
  persist(
    (set, get) => ({
      avatar: createDefaultAvatar(),
      savedAvatars: [],
      ui: {
        activeTab: 'body',
        isLoading: false,
        isSaving: false,
        showExportModal: false,
        showLoadModal: false,
        cameraPosition: [0, 1.2, 2.5],
        cameraTarget: [0, 1, 0],
        viewMode: 'full',
        showWireframe: false,
        showSkeleton: false,
        autoRotate: false,
      },

      // Avatar Actions
      setAvatar: (avatar) => set({ avatar }),
      
      updateBody: (key, value) => set((state) => ({
        avatar: {
          ...state.avatar,
          body: { ...state.avatar.body, [key]: value },
          updatedAt: new Date().toISOString(),
        }
      })),

      updateFace: (key, value) => set((state) => ({
        avatar: {
          ...state.avatar,
          face: { ...state.avatar.face, [key]: value },
          updatedAt: new Date().toISOString(),
        }
      })),

      updateSkin: (updates) => set((state) => ({
        avatar: {
          ...state.avatar,
          skin: { ...state.avatar.skin, ...updates },
          updatedAt: new Date().toISOString(),
        }
      })),

      updateHair: (updates) => set((state) => ({
        avatar: {
          ...state.avatar,
          hair: { ...state.avatar.hair, ...updates },
          updatedAt: new Date().toISOString(),
        }
      })),

      updateFacialHair: (updates) => set((state) => ({
        avatar: {
          ...state.avatar,
          facialHair: { ...state.avatar.facialHair, ...updates },
          updatedAt: new Date().toISOString(),
        }
      })),

      updateClothing: (category, updates) => set((state) => ({
        avatar: {
          ...state.avatar,
          clothing: {
            ...state.avatar.clothing,
            [category]: typeof state.avatar.clothing[category] === 'object' 
              ? { ...state.avatar.clothing[category], ...updates }
              : updates
          },
          updatedAt: new Date().toISOString(),
        }
      })),

      updateAccessories: (updates) => set((state) => ({
        avatar: {
          ...state.avatar,
          accessories: { ...state.avatar.accessories, ...updates },
          updatedAt: new Date().toISOString(),
        }
      })),

      updateAnimal: (updates) => set((state) => ({
        avatar: {
          ...state.avatar,
          animal: state.avatar.animal 
            ? { ...state.avatar.animal, ...updates }
            : { ...defaultAnimalMorphs, ...updates },
          updatedAt: new Date().toISOString(),
        }
      })),

      setStyle: (style) => set((state) => ({
        avatar: {
          ...state.avatar,
          style,
          animal: style === 'animal' ? defaultAnimalMorphs : null,
          updatedAt: new Date().toISOString(),
        }
      })),

      setGender: (gender) => set((state) => ({
        avatar: { ...state.avatar, gender, updatedAt: new Date().toISOString() }
      })),

      setName: (name) => set((state) => ({
        avatar: { ...state.avatar, name, updatedAt: new Date().toISOString() }
      })),

      setFaceScan: (faceScan) => set((state) => ({
        avatar: { ...state.avatar, faceScan, updatedAt: new Date().toISOString() }
      })),

      resetAvatar: () => set({ avatar: createDefaultAvatar() }),

      // Saved Avatars Actions
      saveAvatar: () => set((state) => {
        const existing = state.savedAvatars.findIndex(a => a.id === state.avatar.id);
        const updated = { ...state.avatar, updatedAt: new Date().toISOString() };
        
        if (existing >= 0) {
          const newSaved = [...state.savedAvatars];
          newSaved[existing] = updated;
          return { savedAvatars: newSaved, avatar: updated };
        }
        
        return { savedAvatars: [...state.savedAvatars, updated], avatar: updated };
      }),

      loadAvatar: (id) => set((state) => {
        const found = state.savedAvatars.find(a => a.id === id);
        if (found) return { avatar: { ...found } };
        return state;
      }),

      deleteAvatar: (id) => set((state) => ({
        savedAvatars: state.savedAvatars.filter(a => a.id !== id)
      })),

      // UI Actions
      setActiveTab: (activeTab) => set((state) => ({
        ui: { ...state.ui, activeTab }
      })),

      setLoading: (isLoading) => set((state) => ({
        ui: { ...state.ui, isLoading }
      })),

      setViewMode: (viewMode) => set((state) => ({
        ui: { ...state.ui, viewMode }
      })),

      toggleWireframe: () => set((state) => ({
        ui: { ...state.ui, showWireframe: !state.ui.showWireframe }
      })),

      toggleSkeleton: () => set((state) => ({
        ui: { ...state.ui, showSkeleton: !state.ui.showSkeleton }
      })),

      toggleAutoRotate: () => set((state) => ({
        ui: { ...state.ui, autoRotate: !state.ui.autoRotate }
      })),

      setCameraPosition: (cameraPosition) => set((state) => ({
        ui: { ...state.ui, cameraPosition }
      })),

      setShowExportModal: (showExportModal) => set((state) => ({
        ui: { ...state.ui, showExportModal }
      })),

      setShowLoadModal: (showLoadModal) => set((state) => ({
        ui: { ...state.ui, showLoadModal }
      })),
    }),
    {
      name: 'yocreator-avatar-engine',
      partialize: (state) => ({
        avatar: state.avatar,
        savedAvatars: state.savedAvatars,
      }),
    }
  )
);
