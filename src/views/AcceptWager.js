<<<<<<< HEAD
import React from "react";
=======
>>>>>>> parent of b7a7116... JSX fix done
export function AcceptWager({ wager, standardUnit, accept, decline }) {
  return (
    <div className="Accept_wager">
      <h2>
        Wager: {wager} {standardUnit}
      </h2>
      <button onClick={() => accept()}>Accept Wager</button>
      <button onClick={() => decline()}>Decline Wager</button>
    </div>
  );
}
