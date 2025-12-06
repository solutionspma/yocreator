"use client";
import { useState, useEffect } from "react";

// Avatar customization parameters
export interface AvatarParameters {
  // Body
  height: number; // 60-96 inches (5'0" to 8'0")
  bodyType: "slim" | "athletic" | "average" | "muscular" | "heavy";
  skinTone: string; // hex color
  
  // Head/Face
  headShape: "oval" | "round" | "square" | "heart" | "oblong";
  eyeColor: string;
  eyeShape: "round" | "almond" | "hooded" | "monolid" | "wide";
  noseSize: number; // 0-100
  lipSize: number; // 0-100
  jawWidth: number; // 0-100
  cheekboneHeight: number; // 0-100
  
  // Hair
  hairStyle: string;
  hairColor: string;
  facialHair: string;
  facialHairColor: string;
  
  // Clothing
  topStyle: string;
  topColor: string;
  bottomStyle: string;
  bottomColor: string;
  shoesStyle: string;
  shoesColor: string;
  
  // Accessories
  glasses: string;
  hat: string;
  jewelry: string[];
}

export const defaultParameters: AvatarParameters = {
  height: 72,
  bodyType: "athletic",
  skinTone: "#8D5524",
  headShape: "oval",
  eyeColor: "#4A3728",
  eyeShape: "almond",
  noseSize: 50,
  lipSize: 50,
  jawWidth: 50,
  cheekboneHeight: 50,
  hairStyle: "fade",
  hairColor: "#1a1a1a",
  facialHair: "goatee",
  facialHairColor: "#1a1a1a",
  topStyle: "hoodie",
  topColor: "#1a1a1a",
  bottomStyle: "jeans",
  bottomColor: "#2d3748",
  shoesStyle: "sneakers",
  shoesColor: "#ffffff",
  glasses: "none",
  hat: "none",
  jewelry: []
};

// Skin tone presets
export const skinTonePresets = [
  { name: "Deep Ebony", hex: "#3b2219" },
  { name: "Dark Brown", hex: "#5a3825" },
  { name: "Brown", hex: "#8D5524" },
  { name: "Caramel", hex: "#C68642" },
  { name: "Tan", hex: "#D4A574" },
  { name: "Light Tan", hex: "#E5B887" },
  { name: "Beige", hex: "#F1C27D" },
  { name: "Fair", hex: "#FFDBAC" },
  { name: "Pale", hex: "#FFE4C4" },
  { name: "Porcelain", hex: "#FFF5E6" }
];

// Hair style options
export const hairStyles = [
  "bald", "buzz", "fade", "low-fade", "high-top", "afro", "short-afro", 
  "dreads", "short-dreads", "braids", "cornrows", "twists", 
  "mohawk", "flat-top", "waves", "curly", "straight", 
  "slicked-back", "man-bun", "ponytail"
];

// Facial hair options
export const facialHairStyles = [
  "none", "stubble", "goatee", "full-beard", "short-beard", 
  "long-beard", "mustache", "handlebar", "soul-patch", 
  "chin-strap", "mutton-chops", "van-dyke"
];

// Clothing options
export const clothingOptions = {
  tops: ["t-shirt", "polo", "button-up", "hoodie", "sweater", "tank-top", "jersey", "blazer", "jacket", "vest"],
  bottoms: ["jeans", "joggers", "shorts", "chinos", "dress-pants", "cargo", "sweats", "basketball-shorts"],
  shoes: ["sneakers", "boots", "loafers", "dress-shoes", "jordans", "slides", "sandals"]
};

// Accessory options
export const accessoryOptions = {
  glasses: ["none", "aviators", "wayfarers", "round", "square", "sport", "reading"],
  hats: ["none", "snapback", "fitted", "beanie", "bucket-hat", "fedora", "durag", "headband"],
  jewelry: ["chain", "watch", "earrings", "ring", "bracelet"]
};

interface AvatarControlsProps {
  parameters: AvatarParameters;
  onChange: (params: AvatarParameters) => void;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function AvatarControls({ 
  parameters, 
  onChange,
  activeCategory = "body",
  onCategoryChange 
}: AvatarControlsProps) {
  const [category, setCategory] = useState(activeCategory);
  
  useEffect(() => {
    setCategory(activeCategory);
  }, [activeCategory]);

  const handleChange = <K extends keyof AvatarParameters>(key: K, value: AvatarParameters[K]) => {
    onChange({ ...parameters, [key]: value });
  };

  const categories = [
    { id: "body", icon: "🏃", label: "Body" },
    { id: "face", icon: "😊", label: "Face" },
    { id: "hair", icon: "💇", label: "Hair" },
    { id: "clothes", icon: "👕", label: "Clothes" },
    { id: "accessories", icon: "⌚", label: "Accessories" }
  ];

  // Format height as feet and inches
  const formatHeight = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  const controlStyle = {
    container: { marginBottom: "16px" },
    label: { display: "block", marginBottom: "6px", color: "#ccc", fontSize: "13px", fontWeight: 500 },
    slider: { 
      width: "100%", 
      accentColor: "#7c3aed", 
      height: "6px",
      cursor: "pointer"
    },
    select: { 
      width: "100%", 
      padding: "10px 12px", 
      backgroundColor: "#1a1a1a", 
      border: "1px solid #333", 
      borderRadius: "8px", 
      color: "white", 
      fontSize: "14px",
      cursor: "pointer"
    },
    colorGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: "8px"
    },
    colorSwatch: (hex: string, selected: boolean) => ({
      width: "100%",
      aspectRatio: "1",
      backgroundColor: hex,
      border: selected ? "3px solid #7c3aed" : "2px solid transparent",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "transform 0.15s, border-color 0.15s",
      transform: selected ? "scale(1.1)" : "scale(1)"
    })
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Category tabs */}
      <div style={{ 
        display: "flex", 
        gap: "4px", 
        padding: "12px", 
        borderBottom: "1px solid #222",
        overflowX: "auto"
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setCategory(cat.id);
              onCategoryChange?.(cat.id);
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: category === cat.id ? "#7c3aed" : "#1a1a1a",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "13px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background-color 0.2s"
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Control panel */}
      <div style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
        {/* Body Controls */}
        {category === "body" && (
          <>
            <div style={controlStyle.container}>
              <label style={controlStyle.label}>
                Height: {formatHeight(parameters.height)}
              </label>
              <input
                type="range"
                min="60"
                max="96"
                value={parameters.height}
                onChange={e => handleChange("height", parseInt(e.target.value))}
                style={controlStyle.slider}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#666", marginTop: "4px" }}>
                <span>5'0"</span>
                <span>8'0"</span>
              </div>
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Body Type</label>
              <select
                value={parameters.bodyType}
                onChange={e => handleChange("bodyType", e.target.value as AvatarParameters["bodyType"])}
                style={controlStyle.select}
              >
                {["slim", "athletic", "average", "muscular", "heavy"].map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Skin Tone</label>
              <div style={controlStyle.colorGrid}>
                {skinTonePresets.map(tone => (
                  <button
                    key={tone.hex}
                    title={tone.name}
                    onClick={() => handleChange("skinTone", tone.hex)}
                    style={controlStyle.colorSwatch(tone.hex, parameters.skinTone === tone.hex)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Face Controls */}
        {category === "face" && (
          <>
            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Head Shape</label>
              <select
                value={parameters.headShape}
                onChange={e => handleChange("headShape", e.target.value as AvatarParameters["headShape"])}
                style={controlStyle.select}
              >
                {["oval", "round", "square", "heart", "oblong"].map(shape => (
                  <option key={shape} value={shape}>{shape.charAt(0).toUpperCase() + shape.slice(1)}</option>
                ))}
              </select>
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Eye Shape</label>
              <select
                value={parameters.eyeShape}
                onChange={e => handleChange("eyeShape", e.target.value as AvatarParameters["eyeShape"])}
                style={controlStyle.select}
              >
                {["round", "almond", "hooded", "monolid", "wide"].map(shape => (
                  <option key={shape} value={shape}>{shape.charAt(0).toUpperCase() + shape.slice(1)}</option>
                ))}
              </select>
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Nose Size: {parameters.noseSize}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={parameters.noseSize}
                onChange={e => handleChange("noseSize", parseInt(e.target.value))}
                style={controlStyle.slider}
              />
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Lip Size: {parameters.lipSize}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={parameters.lipSize}
                onChange={e => handleChange("lipSize", parseInt(e.target.value))}
                style={controlStyle.slider}
              />
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Jaw Width: {parameters.jawWidth}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={parameters.jawWidth}
                onChange={e => handleChange("jawWidth", parseInt(e.target.value))}
                style={controlStyle.slider}
              />
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Cheekbone Height: {parameters.cheekboneHeight}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={parameters.cheekboneHeight}
                onChange={e => handleChange("cheekboneHeight", parseInt(e.target.value))}
                style={controlStyle.slider}
              />
            </div>
          </>
        )}

        {/* Hair Controls */}
        {category === "hair" && (
          <>
            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Hair Style</label>
              <select
                value={parameters.hairStyle}
                onChange={e => handleChange("hairStyle", e.target.value)}
                style={controlStyle.select}
              >
                {hairStyles.map(style => (
                  <option key={style} value={style}>
                    {style.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Hair Color</label>
              <input
                type="color"
                value={parameters.hairColor}
                onChange={e => handleChange("hairColor", e.target.value)}
                style={{ ...controlStyle.select, height: "45px", padding: "4px" }}
              />
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Facial Hair</label>
              <select
                value={parameters.facialHair}
                onChange={e => handleChange("facialHair", e.target.value)}
                style={controlStyle.select}
              >
                {facialHairStyles.map(style => (
                  <option key={style} value={style}>
                    {style.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Facial Hair Color</label>
              <input
                type="color"
                value={parameters.facialHairColor}
                onChange={e => handleChange("facialHairColor", e.target.value)}
                style={{ ...controlStyle.select, height: "45px", padding: "4px" }}
              />
            </div>
          </>
        )}

        {/* Clothing Controls */}
        {category === "clothes" && (
          <>
            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Top</label>
              <select
                value={parameters.topStyle}
                onChange={e => handleChange("topStyle", e.target.value)}
                style={controlStyle.select}
              >
                {clothingOptions.tops.map(style => (
                  <option key={style} value={style}>
                    {style.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Top Color</label>
              <input
                type="color"
                value={parameters.topColor}
                onChange={e => handleChange("topColor", e.target.value)}
                style={{ ...controlStyle.select, height: "45px", padding: "4px" }}
              />
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Bottom</label>
              <select
                value={parameters.bottomStyle}
                onChange={e => handleChange("bottomStyle", e.target.value)}
                style={controlStyle.select}
              >
                {clothingOptions.bottoms.map(style => (
                  <option key={style} value={style}>
                    {style.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Bottom Color</label>
              <input
                type="color"
                value={parameters.bottomColor}
                onChange={e => handleChange("bottomColor", e.target.value)}
                style={{ ...controlStyle.select, height: "45px", padding: "4px" }}
              />
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Shoes</label>
              <select
                value={parameters.shoesStyle}
                onChange={e => handleChange("shoesStyle", e.target.value)}
                style={controlStyle.select}
              >
                {clothingOptions.shoes.map(style => (
                  <option key={style} value={style}>
                    {style.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Shoes Color</label>
              <input
                type="color"
                value={parameters.shoesColor}
                onChange={e => handleChange("shoesColor", e.target.value)}
                style={{ ...controlStyle.select, height: "45px", padding: "4px" }}
              />
            </div>
          </>
        )}

        {/* Accessories Controls */}
        {category === "accessories" && (
          <>
            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Glasses</label>
              <select
                value={parameters.glasses}
                onChange={e => handleChange("glasses", e.target.value)}
                style={controlStyle.select}
              >
                {accessoryOptions.glasses.map(style => (
                  <option key={style} value={style}>
                    {style === "none" ? "None" : style.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Hat</label>
              <select
                value={parameters.hat}
                onChange={e => handleChange("hat", e.target.value)}
                style={controlStyle.select}
              >
                {accessoryOptions.hats.map(style => (
                  <option key={style} value={style}>
                    {style === "none" ? "None" : style.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div style={controlStyle.container}>
              <label style={controlStyle.label}>Jewelry</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {accessoryOptions.jewelry.map(item => (
                  <button
                    key={item}
                    onClick={() => {
                      const current = parameters.jewelry || [];
                      const updated = current.includes(item)
                        ? current.filter(i => i !== item)
                        : [...current, item];
                      handleChange("jewelry", updated);
                    }}
                    style={{
                      padding: "8px 14px",
                      backgroundColor: parameters.jewelry?.includes(item) ? "#7c3aed" : "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "20px",
                      color: "white",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
