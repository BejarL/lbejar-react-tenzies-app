export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };

  // Function to generate dot elements based on the die value
  function generateDots(value) {
    // Create an array of dot elements
    const dots = [];
    for (let i = 0; i < value; i++) {
      dots.push(<span key={i} className="dot"></span>);
    }
    return dots;
  }

  return (
    <div className="die-face" style={styles} onClick={props.holdDice}>
      {/* Render the dots inside the die face */}
      <div className="dots">{generateDots(props.value)}</div>
    </div>
  );
}
