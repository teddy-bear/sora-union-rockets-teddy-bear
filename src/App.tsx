import React, {useEffect, useState} from 'react';
import './css/skin.scss';
import Grid from "@mui/material/Grid";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Movies from "./movies";
import {Button} from "@mui/material";

export default function App() {

    const [reviews, setReviews] = useState<Array<ReviewType>>([]);

    interface ReviewType {
        label: string,
        year: number,
    }

    // holds whole selected object
    const [item, setItem] = useState<ReviewType | null>(null);
    // shows string value within a box
    const [input, setInput] = useState("");
    const [options, setOptions] = useState<Array<object>>([]);

    // Load movies list on render
    useEffect(() => {
        setOptions(Movies);
    }, []);

    const removeItem = (review: object) => {
        const arr = reviews.filter((item) => {
            // @ts-ignore
            return item.label !== review.label;
        })

        setReviews(arr);
    }

    const content = reviews.length ? reviews.map((item, index) => (
        <div className='item box'
             key={index}
        >
            <h3>{item.label}</h3>
            <div className="name">{item.year}</div>
            <span className="icon-delete">
                    <DeleteIcon onClick={() => removeItem(item)}/>
                </span>
        </div>
    )) : 'no reviews yet';

    return (
        <div className="App">
            <Grid container spacing={2}>
                <Grid item xs={6}>

                    <div className="rockets-list">
                        <header>
                            <h1>List of Rockets</h1>
                            <span className='icon-add'><RocketLaunchIcon/></span>
                        </header>
                        <div className="list">
                            {content}
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <header>
                        <h1>Add new Rocket</h1>
                    </header>
                    <div className="box box-add">
                        <h1>{item && item.label}</h1>
                        <h2>{item && item.year}</h2>
                        {/* todo: 1) Add multiple select, 2) prevent duplicated edits */}
                        <Autocomplete
                            filterOptions={(x) => x}
                            onInputChange={(e, v) => {
                                setInput(v);
                            }}
                            onChange={(e, value) => setItem({...value} as ReviewType)}
                            id="combo-box-demo"
                            options={options}
                            //sx={{width: 300}}
                            renderInput={(params) => <TextField {...params} label="Movie"/>}
                        />
                        <Button className='btn-add' onClick={() => setReviews([...reviews, item as ReviewType])}
                                variant="contained">
                            Add item
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}
