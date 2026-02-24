import React from 'react'

function ImageFromDrive() {
  // Original Drive share link
  const shareUrl = "https://drive.google.com/file/d/1AdIzalgrEU7YzypVhTTHXjJoeccwM5Hz/view?usp=sharing";
  
  // Extract the file ID from the share URL
  const fileId = shareUrl.match(/\/d\/([^\/]+)/)?.[1];
  
  // Convert to direct image URL that works in <img> tags
  const imageUrl = fileId 
    // ? `https://drive.google.com/uc?export=view&id=${fileId}`
    ? `https://lh3.googleusercontent.com/d/${fileId}`
    : shareUrl;

  console.log("File ID:", fileId);
  console.log("Image URL:", imageUrl);

  return (
    <div>
      <h2>Google Drive Image</h2>
      <img 
        src={imageUrl} 
        alt="Drive" 
        style={{ width: "300px" }}
        onError={(e) => {
          console.error("Image failed to load. URL was:", imageUrl);
          // Try alternative format if first one fails
        //   if (fileId && e.target.src.includes("export=view")) {
        //     e.target.src = `https://lh3.googleusercontent.com/d/${fileId}`;
        //   }
        }}
      />
    </div>
  );
}

export default ImageFromDrive
