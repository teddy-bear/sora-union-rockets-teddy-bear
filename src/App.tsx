import React from 'react';
import './App.css';
import GoogleMaps from "./google_api";
import SearchField from "./searchField";
import ComboBox from "./comboBox";
import Grid from "@mui/material/Grid";

function App() {
    return (
        <div className="App">
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    added carts are here
                </Grid>
                <Grid item xs={6}>
                    <ComboBox/>
                </Grid>
            </Grid>
        </div>
    );
}

export default App;
