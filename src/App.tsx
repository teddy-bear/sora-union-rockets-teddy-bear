// todo points:
// debounce/throttle for search keystrokes optimization

import React, {useState} from 'react';
import './css/skin.scss';
import Grid from "@mui/material/Grid";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {Button} from "@mui/material";

type GitUser = {
    login: string,
    label?: string,
    id: number,
    node_id: string
    avatar_url: string,
    gravatar_id?: any,
    url: string,
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string,
    site_admin: boolean,
    score: number
};

/**
 * Render user block
 * @param avatar_url
 * @param html_url
 * @param login
 * @param id
 * @constructor
 */
function User({avatar_url, html_url, login, id}: GitUser) {
    return (
        <>
            <header>
                <div className="avatar">
                    <img src={avatar_url} alt={login}/>
                </div>
                <h3><a href={html_url} rel="noreferrer" target='_blank'>{login}</a></h3>
            </header>
            <small className="user-id">id: {id}</small>
        </>
    )
}

export default function App() {
    /**
     * Do search
     * optimized for username string search, Eg: mike, sam etc.
     * @param needle
     */
    const getUserData = async (needle: string) => {
        if (needle.length) {
            const gitHubUrl = `https://api.github.com/search/users?q=${needle}&per_page=20`;  // where 20 is a temporary limit
            const response = await fetch(gitHubUrl);
            const jsonData = await response.json();
            if (jsonData && response.ok) {
                let arr = jsonData.items;

                // pass strings array to the Autocomplete widget
                let labels = arr.map((item: GitUser) => item.login);

                setOptions(labels);
                setUserGit(arr);
            } else if (needle !== "") {
                alert(jsonData.message);
            }
        } else {
            // Clear search field
            setOptions([]);
            setUserGit([]);
        }
    };

    /**
     * Remove entry
     * @param review
     */
    const removeItem = (review: GitUser) => {
        const arr = localUsers && localUsers.filter((item) => {
            return item.id !== review.id;
        })

        setLocalUsers(arr);
    }

    // Added users
    const [localUsers, setLocalUsers] = useState<Array<GitUser> | []>([]);

    // Found users
    const [usersGit, setUserGit] = useState<Array<GitUser> | []>([]);

    // Currently selected user
    const [item, setItem] = useState<GitUser | null>(null);

    // String value within a box
    const [input, setInput] = useState<string | null>();

    // Specify Autocomplete field options
    const [options, setOptions] = useState<Array<string>>([]);

    /**
     * Render Review Item box
     */
    const savedUsers = localUsers.length ? localUsers.map((item, index) => (
        <div className='item box'
             key={index}
        >
            <User {...item}/>
            <DeleteIcon className="icon-delete" onClick={() => removeItem(item)}/>
        </div>
    )) : 'no reviews yet';

    /**
     * Render selected user
     */
    const selectedUser = item ? <div className='current-user box item'>
            <User {...item}/>
        </div>
        : null

    return (
        <div className="App">
            <Grid container spacing={2}>
                <Grid item xs={6}>

                    <div className="rockets-list">
                        <header>
                            <h1>List of Rockets</h1>
                            <RocketLaunchIcon className='icon-add'/>
                        </header>
                        <div className="list">
                            {savedUsers}
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <header>
                        <h1>Add new Rocket</h1>
                    </header>
                    <div className="box-add">
                        {selectedUser}
                        {/* todo: 1) Add multiple select, 2) prevent duplicated entries */}
                        <Autocomplete
                            filterOptions={(x) => x}
                            onInputChange={(e, v) => {
                                setInput(v);
                                getUserData(v);
                            }}
                            onChange={(e, value) => {
                                setInput(value);
                                if (value) {
                                    const arr = usersGit && usersGit.filter((item) => {
                                        return item.login === value;
                                    })
                                    setItem(arr[0]);
                                } else {
                                    setItem(null);
                                }
                            }}
                            id="combo-box"
                            options={options}
                            renderInput={(params) => <TextField {...params} label="Search Git Users"/>}
                        />
                        <Button className='btn-add' variant="contained" onClick={() => {
                            if (input) {
                                const arr = usersGit && usersGit.filter((item) => {
                                    return item.login === input;
                                })
                                setLocalUsers([...localUsers, arr[0] as GitUser]);
                            }
                        }}
                        >
                            Add item
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}
