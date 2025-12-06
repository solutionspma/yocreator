"use client";
import { useState, useRef, useEffect } from "react";

export default function AvatarPage() {
  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [aiPreviewUrl, setAiPreviewUrl] = useState<string | null>(null);
  
  // Active category for customization
  const [activeCategory, setActiveCategory] = useState<"face" | "body" | "hair" | "facial" | "outfit" | "accessories">("face");
  
  // ============== FACE ==============
  const [skinTone, setSkinTone] = useState("medium");
  const [faceShape, setFaceShape] = useState("oval");
  const [eyeShape, setEyeShape] = useState("almond");
  const [eyeColor, setEyeColor] = useState("brown");
  const [noseType, setNoseType] = useState("medium");
  const [lipShape, setLipShape] = useState("medium");
  const [age, setAge] = useState(30);
  
  // ============== BODY ==============
  const [gender, setGender] = useState("male");
  const [heightFeet, setHeightFeet] = useState(6);
  const [heightInches, setHeightInches] = useState(6);
  const [weight, setWeight] = useState(200);
  const [bodyType, setBodyType] = useState("athletic");
  const [muscleDefinition, setMuscleDefinition] = useState(70);
  
  // ============== HAIR ==============
  const [hairStyle, setHairStyle] = useState("fade");
  const [hairColor, setHairColor] = useState("black");
  const [hairLength, setHairLength] = useState("short");
  
  // ============== FACIAL HAIR ==============
  const [facialHairStyle, setFacialHairStyle] = useState("stubble");
  const [facialHairColor, setFacialHairColor] = useState("black");
  const [facialHairDensity, setFacialHairDensity] = useState(50);
  
  // ============== OUTFIT ==============
  const [outfitStyle, setOutfitStyle] = useState("business");
  const [topType, setTopType] = useState("suit-jacket");
  const [topColor, setTopColor] = useState("#1a1a2e");
  const [bottomType, setBottomType] = useState("dress-pants");
  const [bottomColor, setBottomColor] = useState("#1a1a2e");
  const [shoeType, setShoeType] = useState("dress-shoes");
  const [shoeColor, setShoeColor] = useState("#000000");
  
  // ============== ACCESSORIES ==============
  const [glasses, setGlasses] = useState("none");
  const [hat, setHat] = useState("none");
  const [jewelry, setJewelry] = useState<string[]>([]);
  const [watch, setWatch] = useState("none");
  
  // ============== 3D PREVIEW ==============
  const [rotation, setRotation] = useState(0);
  const [isDraggingPreview, setIsDraggingPreview] = useState(false);
  const [lastX, setLastX] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // QR Code for phone scanner
  const [showQRCode, setShowQRCode] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const qrCodeUrl = `https://yocreator.netlify.app/studio/avatar/scan?session=${sessionId}`;

  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

  // Handle 3D preview rotation
  const handlePreviewMouseDown = (e: React.MouseEvent) => {
    setIsDraggingPreview(true);
    setLastX(e.clientX);
  };
  
  const handlePreviewMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingPreview) return;
    const delta = e.clientX - lastX;
    setRotation(prev => prev + delta * 0.5);
    setLastX(e.clientX);
  };
  
  const handlePreviewMouseUp = () => {
    setIsDraggingPreview(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDraggingPreview(true);
    setLastX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingPreview) return;
    const delta = e.touches[0].clientX - lastX;
    setRotation(prev => prev + delta * 0.5);
    setLastX(e.touches[0].clientX);
  };

  // Skin tone options
  const skinTones = [
    { id: "very-light", label: "Very Light", color: "#ffe5d4" },
    { id: "light", label: "Light", color: "#ffd5b8" },
    { id: "medium-light", label: "Medium Light", color: "#d4a574" },
    { id: "medium", label: "Medium", color: "#c68642" },
    { id: "tan", label: "Tan", color: "#b07340" },
    { id: "brown", label: "Brown", color: "#8d5524" },
    { id: "dark-brown", label: "Dark Brown", color: "#5c3d2e" },
    { id: "dark", label: "Dark", color: "#3d2314" },
    { id: "very-dark", label: "Very Dark", color: "#2d1810" },
  ];

  const hairStyles = [
    { id: "bald", label: "Bald" },
    { id: "buzz", label: "Buzz Cut" },
    { id: "fade", label: "Fade" },
    { id: "high-top-fade", label: "High Top Fade" },
    { id: "short", label: "Short" },
    { id: "medium", label: "Medium" },
    { id: "long", label: "Long" },
    { id: "afro", label: "Afro" },
    { id: "afro-short", label: "Short Afro" },
    { id: "braids", label: "Braids" },
    { id: "cornrows", label: "Cornrows" },
    { id: "locs", label: "Locs/Dreads" },
    { id: "twists", label: "Twists" },
    { id: "curly", label: "Curly" },
    { id: "wavy", label: "Wavy" },
    { id: "slicked-back", label: "Slicked Back" },
    { id: "mohawk", label: "Mohawk" },
    { id: "man-bun", label: "Man Bun" },
    { id: "ponytail", label: "Ponytail" },
  ];

  const facialHairStyles = [
    { id: "none", label: "Clean Shaven" },
    { id: "stubble", label: "Stubble" },
    { id: "light-beard", label: "Light Beard" },
    { id: "short-beard", label: "Short Beard" },
    { id: "medium-beard", label: "Medium Beard" },
    { id: "full-beard", label: "Full Beard" },
    { id: "long-beard", label: "Long Beard" },
    { id: "goatee", label: "Goatee" },
    { id: "van-dyke", label: "Van Dyke" },
    { id: "mustache", label: "Mustache" },
    { id: "handlebar", label: "Handlebar Mustache" },
    { id: "soul-patch", label: "Soul Patch" },
    { id: "chinstrap", label: "Chin Strap" },
  ];

  const outfitStyles = [
    { id: "business", label: "Business Professional" },
    { id: "casual", label: "Casual" },
    { id: "formal", label: "Formal/Tuxedo" },
    { id: "streetwear", label: "Streetwear" },
    { id: "athletic", label: "Athletic/Sport" },
    { id: "creative", label: "Creative/Artistic" },
    { id: "tech", label: "Tech/Startup" },
    { id: "luxury", label: "Luxury Designer" },
  ];

  const topTypes = [
    { id: "suit-jacket", label: "Suit Jacket" },
    { id: "blazer", label: "Blazer" },
    { id: "dress-shirt", label: "Dress Shirt" },
    { id: "polo", label: "Polo Shirt" },
    { id: "tshirt", label: "T-Shirt" },
    { id: "hoodie", label: "Hoodie" },
    { id: "sweater", label: "Sweater" },
    { id: "turtleneck", label: "Turtleneck" },
    { id: "leather-jacket", label: "Leather Jacket" },
    { id: "bomber-jacket", label: "Bomber Jacket" },
    { id: "vest", label: "Vest" },
  ];

  const hatTypes = [
    { id: "none", label: "No Hat" },
    { id: "baseball-cap", label: "Baseball Cap" },
    { id: "snapback", label: "Snapback" },
    { id: "fitted-cap", label: "Fitted Cap" },
    { id: "beanie", label: "Beanie" },
    { id: "fedora", label: "Fedora" },
    { id: "bucket-hat", label: "Bucket Hat" },
    { id: "durag", label: "Durag" },
    { id: "headband", label: "Headband" },
  ];

  const glassesTypes = [
    { id: "none", label: "No Glasses" },
    { id: "aviator", label: "Aviator" },
    { id: "wayfarer", label: "Wayfarer" },
    { id: "round", label: "Round" },
    { id: "square", label: "Square" },
    { id: "rectangular", label: "Rectangular" },
    { id: "sport", label: "Sport/Wrap" },
    { id: "reading", label: "Reading Glasses" },
  ];

  // Generate avatar with DALL-E
  async function generatePreview() {
    if (!name.trim()) return alert("Enter an avatar name first");
    
    setGeneratingPreview(true);
    
    try {
      // Build detailed description
      const skinToneLabel = skinTones.find(s => s.id === skinTone)?.label || skinTone;
      const hairStyleLabel = hairStyles.find(h => h.id === hairStyle)?.label || hairStyle;
      const facialHairLabel = facialHairStyles.find(f => f.id === facialHairStyle)?.label || facialHairStyle;
      const heightStr = `${heightFeet}'${heightInches}"`;
      
      let personDesc = `A ${gender === "male" ? "man" : "woman"} with ${skinToneLabel.toLowerCase()} skin tone`;
      personDesc += `, approximately ${age} years old`;
      personDesc += `, ${heightStr} tall (${heightFeet * 12 + heightInches} inches), ${weight} lbs`;
      personDesc += `, ${bodyType} build`;
      if (muscleDefinition > 50) personDesc += ` with visible muscle definition`;
      
      // Hair
      if (hairStyle !== "bald") {
        personDesc += `, ${hairStyleLabel.toLowerCase()} ${hairColor} hair`;
      } else {
        personDesc += `, bald head`;
      }
      
      // Facial hair
      if (facialHairStyle !== "none") {
        personDesc += `, ${facialHairLabel.toLowerCase()}`;
      }
      
      // Face features
      personDesc += `, ${faceShape} face shape, ${eyeColor} eyes`;
      
      // Outfit
      const topLabel = topTypes.find(t => t.id === topType)?.label || topType;
      personDesc += `. Wearing a ${topLabel.toLowerCase()}`;
      
      // Accessories
      if (glasses !== "none") {
        const glassesLabel = glassesTypes.find(g => g.id === glasses)?.label || glasses;
        personDesc += `, ${glassesLabel.toLowerCase()}`;
      }
      if (hat !== "none") {
        const hatLabel = hatTypes.find(h => h.id === hat)?.label || hat;
        personDesc += `, ${hatLabel.toLowerCase()}`;
      }

      const prompt = `Create a photorealistic portrait of: ${personDesc}. 

Professional photography, studio lighting, high detail, 4K quality. The person should have a confident, professional expression. Upper body shot showing face and shoulders clearly. The skin tone, facial features, and all physical characteristics MUST accurately match the description provided.`;

      console.log("Generating with prompt:", prompt);

      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "hd",
        }),
      });

      const data = await response.json();
      
      if (data.data?.[0]?.url) {
        setAiPreviewUrl(data.data[0].url);
      } else if (data.error) {
        throw new Error(data.error.message || "Generation failed");
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setGeneratingPreview(false);
    }
  }

  // Create job in Supabase
  async function createAvatarJob() {
    if (!name.trim()) return alert("Enter an avatar name first");
    setCreating(true);
    
    try {
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
      
      const payload = {
        type: "avatar",
        status: "queued",
        payload: {
          name,
          face: { skinTone, faceShape, eyeShape, eyeColor, noseType, lipShape, age },
          body: { gender, heightFeet, heightInches, weight, bodyType, muscleDefinition },
          hair: { hairStyle, hairColor, hairLength },
          facialHair: { facialHairStyle, facialHairColor, facialHairDensity },
          outfit: { outfitStyle, topType, topColor, bottomType, bottomColor, shoeType, shoeColor },
          accessories: { glasses, hat, jewelry, watch },
          previewUrl: aiPreviewUrl,
        },
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/render_jobs`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create job");
      
      alert("✅ Avatar job created! Check Projects page for status.");
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setCreating(false);
    }
  }

  // Styles
  const categoryButtonStyle = (active: boolean) => ({
    padding: "12px 16px",
    backgroundColor: active ? "#7c3aed" : "#1a1a1a",
    border: `1px solid ${active ? "#7c3aed" : "#333"}`,
    borderRadius: "8px",
    color: active ? "white" : "#888",
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "4px",
    minWidth: isMobile ? "60px" : "80px",
  });

  const sliderStyle = {
    width: "100%",
    accentColor: "#7c3aed",
  };

  const selectStyle = {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "6px",
    color: "white",
    fontSize: "14px",
  };

  const labelStyle = {
    display: "block",
    color: "#888",
    fontSize: "12px",
    marginBottom: "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "white" }}>
      {/* Header */}
      <div style={{ padding: isMobile ? "16px" : "20px 32px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? "20px" : "24px" }}>🎮 Character Creator</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "13px" }}>Build your avatar like 2K/FIFA</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setShowQRCode(true)} style={{ padding: "10px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>
            📱 Phone Scan
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 350px", minHeight: "calc(100vh - 80px)" }}>
        {/* Left: Customization Panel */}
        <div style={{ padding: isMobile ? "16px" : "24px", borderRight: isMobile ? "none" : "1px solid #222", overflowY: "auto" }}>
          {/* Name Input */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Avatar Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name..."
              style={{ ...selectStyle, fontSize: "16px" }}
            />
          </div>

          {/* Category Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "8px" }}>
            {[
              { id: "face", icon: "😊", label: "Face" },
              { id: "body", icon: "🏋️", label: "Body" },
              { id: "hair", icon: "💇", label: "Hair" },
              { id: "facial", icon: "🧔", label: "Facial" },
              { id: "outfit", icon: "👔", label: "Outfit" },
              { id: "accessories", icon: "🕶️", label: "Extras" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                style={categoryButtonStyle(activeCategory === cat.id)}
              >
                <span style={{ fontSize: "20px" }}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* FACE OPTIONS */}
          {activeCategory === "face" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>Skin Tone</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                  {skinTones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSkinTone(tone.id)}
                      title={tone.label}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        backgroundColor: tone.color,
                        border: skinTone === tone.id ? "3px solid #7c3aed" : "2px solid #333",
                        borderRadius: "8px",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      {skinTone === tone.id && (
                        <span style={{ position: "absolute", bottom: "2px", right: "2px", fontSize: "12px" }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
                <p style={{ color: "#666", fontSize: "11px", marginTop: "4px" }}>
                  Selected: {skinTones.find(s => s.id === skinTone)?.label}
                </p>
              </div>

              <div>
                <label style={labelStyle}>Age: {age} years</label>
                <input type="range" min="18" max="80" value={age} onChange={(e) => setAge(parseInt(e.target.value))} style={sliderStyle} />
              </div>

              <div>
                <label style={labelStyle}>Face Shape</label>
                <select value={faceShape} onChange={(e) => setFaceShape(e.target.value)} style={selectStyle}>
                  <option value="oval">Oval</option>
                  <option value="round">Round</option>
                  <option value="square">Square</option>
                  <option value="rectangular">Rectangular</option>
                  <option value="heart">Heart</option>
                  <option value="diamond">Diamond</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Eye Color</label>
                <select value={eyeColor} onChange={(e) => setEyeColor(e.target.value)} style={selectStyle}>
                  <option value="brown">Brown</option>
                  <option value="dark-brown">Dark Brown</option>
                  <option value="black">Black</option>
                  <option value="hazel">Hazel</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="gray">Gray</option>
                </select>
              </div>
            </div>
          )}

          {/* BODY OPTIONS */}
          {activeCategory === "body" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>Gender</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  {["male", "female"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: gender === g ? "#7c3aed" : "#1a1a1a",
                        border: `1px solid ${gender === g ? "#7c3aed" : "#333"}`,
                        borderRadius: "8px",
                        color: gender === g ? "white" : "#888",
                        cursor: "pointer",
                        fontSize: "14px",
                        textTransform: "capitalize",
                      }}
                    >
                      {g === "male" ? "👨 Male" : "👩 Female"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Height: {heightFeet}'{heightInches}"</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: "#666", fontSize: "11px" }}>Feet (4-8)</span>
                    <input type="range" min="4" max="8" value={heightFeet} onChange={(e) => setHeightFeet(parseInt(e.target.value))} style={sliderStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: "#666", fontSize: "11px" }}>Inches (0-11)</span>
                    <input type="range" min="0" max="11" value={heightInches} onChange={(e) => setHeightInches(parseInt(e.target.value))} style={sliderStyle} />
                  </div>
                </div>
                <p style={{ color: "#666", fontSize: "11px", marginTop: "4px" }}>
                  Total: {heightFeet * 12 + heightInches} inches ({Math.round((heightFeet * 12 + heightInches) * 2.54)} cm)
                </p>
              </div>

              <div>
                <label style={labelStyle}>Weight: {weight} lbs</label>
                <input type="range" min="100" max="400" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} style={sliderStyle} />
                <p style={{ color: "#666", fontSize: "11px" }}>{Math.round(weight * 0.453)} kg</p>
              </div>

              <div>
                <label style={labelStyle}>Body Type</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {["slim", "average", "athletic", "muscular", "heavy", "stocky"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setBodyType(type)}
                      style={{
                        padding: "10px 8px",
                        backgroundColor: bodyType === type ? "#7c3aed" : "#1a1a1a",
                        border: `1px solid ${bodyType === type ? "#7c3aed" : "#333"}`,
                        borderRadius: "6px",
                        color: bodyType === type ? "white" : "#888",
                        fontSize: "12px",
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Muscle Definition: {muscleDefinition}%</label>
                <input type="range" min="0" max="100" value={muscleDefinition} onChange={(e) => setMuscleDefinition(parseInt(e.target.value))} style={sliderStyle} />
              </div>
            </div>
          )}

          {/* HAIR OPTIONS */}
          {activeCategory === "hair" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>Hair Style</label>
                <select value={hairStyle} onChange={(e) => setHairStyle(e.target.value)} style={selectStyle}>
                  {hairStyles.map((h) => (
                    <option key={h.id} value={h.id}>{h.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Hair Color</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {[
                    { id: "black", color: "#1a1a1a" },
                    { id: "dark-brown", color: "#3d2314" },
                    { id: "brown", color: "#8b4513" },
                    { id: "light-brown", color: "#a0522d" },
                    { id: "blonde", color: "#daa520" },
                    { id: "red", color: "#8b0000" },
                    { id: "gray", color: "#808080" },
                    { id: "white", color: "#e0e0e0" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setHairColor(c.id)}
                      style={{
                        padding: "8px",
                        backgroundColor: c.color,
                        border: hairColor === c.id ? "3px solid #7c3aed" : "2px solid #333",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "10px",
                        color: ["blonde", "white", "gray"].includes(c.id) ? "#000" : "#fff",
                        textTransform: "capitalize",
                      }}
                    >
                      {c.id.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FACIAL HAIR OPTIONS */}
          {activeCategory === "facial" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>Facial Hair Style</label>
                <select value={facialHairStyle} onChange={(e) => setFacialHairStyle(e.target.value)} style={selectStyle}>
                  {facialHairStyles.map((f) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>

              {facialHairStyle !== "none" && (
                <>
                  <div>
                    <label style={labelStyle}>Facial Hair Color</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                      {[
                        { id: "black", color: "#1a1a1a" },
                        { id: "dark-brown", color: "#3d2314" },
                        { id: "brown", color: "#8b4513" },
                        { id: "gray", color: "#808080" },
                      ].map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setFacialHairColor(c.id)}
                          style={{
                            padding: "8px",
                            backgroundColor: c.color,
                            border: facialHairColor === c.id ? "3px solid #7c3aed" : "2px solid #333",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "10px",
                            color: c.id === "gray" ? "#000" : "#fff",
                          }}
                        >
                          {c.id}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Density: {facialHairDensity}%</label>
                    <input type="range" min="10" max="100" value={facialHairDensity} onChange={(e) => setFacialHairDensity(parseInt(e.target.value))} style={sliderStyle} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* OUTFIT OPTIONS */}
          {activeCategory === "outfit" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>Style Preset</label>
                <select value={outfitStyle} onChange={(e) => setOutfitStyle(e.target.value)} style={selectStyle}>
                  {outfitStyles.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Top</label>
                <select value={topType} onChange={(e) => setTopType(e.target.value)} style={selectStyle}>
                  {topTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Top Color</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input type="color" value={topColor} onChange={(e) => setTopColor(e.target.value)} style={{ width: "50px", height: "40px", border: "none", borderRadius: "6px", cursor: "pointer" }} />
                  <span style={{ color: "#888", fontSize: "13px" }}>{topColor}</span>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Bottom</label>
                <select value={bottomType} onChange={(e) => setBottomType(e.target.value)} style={selectStyle}>
                  <option value="dress-pants">Dress Pants</option>
                  <option value="jeans">Jeans</option>
                  <option value="chinos">Chinos</option>
                  <option value="joggers">Joggers</option>
                  <option value="shorts">Shorts</option>
                </select>
              </div>
            </div>
          )}

          {/* ACCESSORIES OPTIONS */}
          {activeCategory === "accessories" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>Glasses</label>
                <select value={glasses} onChange={(e) => setGlasses(e.target.value)} style={selectStyle}>
                  {glassesTypes.map((g) => (
                    <option key={g.id} value={g.id}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Hat/Headwear</label>
                <select value={hat} onChange={(e) => setHat(e.target.value)} style={selectStyle}>
                  {hatTypes.map((h) => (
                    <option key={h.id} value={h.id}>{h.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Watch</label>
                <select value={watch} onChange={(e) => setWatch(e.target.value)} style={selectStyle}>
                  <option value="none">No Watch</option>
                  <option value="luxury">Luxury Watch</option>
                  <option value="smart">Smart Watch</option>
                  <option value="sport">Sport Watch</option>
                  <option value="classic">Classic Watch</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Jewelry</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["chain", "earring", "ring", "bracelet"].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        if (jewelry.includes(item)) {
                          setJewelry(jewelry.filter(j => j !== item));
                        } else {
                          setJewelry([...jewelry, item]);
                        }
                      }}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: jewelry.includes(item) ? "#7c3aed" : "#1a1a1a",
                        border: `1px solid ${jewelry.includes(item) ? "#7c3aed" : "#333"}`,
                        borderRadius: "6px",
                        color: jewelry.includes(item) ? "white" : "#888",
                        fontSize: "13px",
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: 3D Preview Panel */}
        <div style={{ backgroundColor: "#111", padding: isMobile ? "16px" : "24px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "#888" }}>Preview</h3>
          
          {/* 3D Avatar Preview */}
          <div
            ref={previewRef}
            onMouseDown={handlePreviewMouseDown}
            onMouseMove={handlePreviewMouseMove}
            onMouseUp={handlePreviewMouseUp}
            onMouseLeave={handlePreviewMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setIsDraggingPreview(false)}
            style={{
              flex: 1,
              minHeight: "300px",
              backgroundColor: "#0a0a0a",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isDraggingPreview ? "grabbing" : "grab",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background gradient for 3D effect */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40%",
              background: "linear-gradient(transparent, rgba(124, 58, 237, 0.1))",
              borderRadius: "50%",
              transform: "scaleY(0.3)",
            }} />
            
            {/* Avatar display */}
            {aiPreviewUrl ? (
              <div style={{ 
                transform: `rotateY(${rotation}deg)`,
                transition: isDraggingPreview ? "none" : "transform 0.1s",
                transformStyle: "preserve-3d",
              }}>
                <img 
                  src={aiPreviewUrl} 
                  alt="Avatar" 
                  style={{ 
                    maxWidth: "280px", 
                    maxHeight: "350px", 
                    borderRadius: "12px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                  }} 
                />
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#444" }}>
                {/* Silhouette placeholder */}
                <svg width="120" height="180" viewBox="0 0 120 180" fill="none">
                  <ellipse cx="60" cy="45" rx="35" ry="40" fill="#333" />
                  <ellipse cx="60" cy="130" rx="50" ry="60" fill="#333" />
                  <circle cx="60" cy="40" r="25" fill={skinTones.find(s => s.id === skinTone)?.color || "#666"} opacity="0.5" />
                </svg>
                <p style={{ fontSize: "13px", marginTop: "12px" }}>Drag to rotate</p>
                <p style={{ fontSize: "11px", color: "#555" }}>Generate preview to see your avatar</p>
              </div>
            )}
          </div>

          {/* Rotation indicator */}
          <div style={{ marginTop: "12px", display: "flex", justifyContent: "center", gap: "8px" }}>
            <button onClick={() => setRotation(r => r - 45)} style={{ padding: "8px 16px", backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color: "#888", cursor: "pointer" }}>◀ Rotate</button>
            <button onClick={() => setRotation(0)} style={{ padding: "8px 16px", backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color: "#888", cursor: "pointer" }}>Reset</button>
            <button onClick={() => setRotation(r => r + 45)} style={{ padding: "8px 16px", backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", color: "#888", cursor: "pointer" }}>Rotate ▶</button>
          </div>

          {/* Stats display */}
          <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#1a1a1a", borderRadius: "8px", fontSize: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div><span style={{ color: "#666" }}>Height:</span> <span style={{ color: "white" }}>{heightFeet}'{heightInches}"</span></div>
              <div><span style={{ color: "#666" }}>Weight:</span> <span style={{ color: "white" }}>{weight} lbs</span></div>
              <div><span style={{ color: "#666" }}>Build:</span> <span style={{ color: "white", textTransform: "capitalize" }}>{bodyType}</span></div>
              <div><span style={{ color: "#666" }}>Age:</span> <span style={{ color: "white" }}>{age}</span></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <button 
              onClick={generatePreview} 
              disabled={generatingPreview || !name.trim()}
              style={{ 
                padding: "14px", 
                backgroundColor: "#2563eb", 
                color: "white", 
                border: "none", 
                borderRadius: "8px", 
                fontSize: "15px", 
                fontWeight: "600", 
                cursor: generatingPreview || !name.trim() ? "not-allowed" : "pointer",
                opacity: generatingPreview || !name.trim() ? 0.7 : 1,
              }}
            >
              {generatingPreview ? "✨ Generating..." : "👁️ Generate Preview"}
            </button>
            <button 
              onClick={createAvatarJob} 
              disabled={creating}
              style={{ 
                padding: "14px", 
                backgroundColor: "#7c3aed", 
                color: "white", 
                border: "none", 
                borderRadius: "8px", 
                fontSize: "15px", 
                fontWeight: "600", 
                cursor: creating ? "not-allowed" : "pointer",
                opacity: creating ? 0.7 : 1,
              }}
            >
              {creating ? "Creating..." : "🚀 Build Avatar"}
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ backgroundColor: "#1a1a1a", borderRadius: "16px", padding: "32px", maxWidth: "400px", width: "100%", textAlign: "center" }}>
            <h2 style={{ margin: "0 0 16px" }}>📱 Scan with Phone</h2>
            <p style={{ color: "#888", marginBottom: "20px", fontSize: "14px" }}>Scan this QR code to open the face scanner on your phone.</p>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`} 
              alt="QR Code" 
              style={{ borderRadius: "8px", marginBottom: "20px", backgroundColor: "white", padding: "8px" }} 
            />
            <p style={{ color: "#666", fontSize: "11px", marginBottom: "20px", wordBreak: "break-all" }}>
              Or visit: {qrCodeUrl}
            </p>
            <button onClick={() => setShowQRCode(false)} style={{ padding: "12px 32px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
