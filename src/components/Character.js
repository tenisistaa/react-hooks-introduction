import React, { useState, useEffect } from 'react';

import Summary from './Summary';

const Character = props => {

  const [loadedCharacter, setLoadedCharacter] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = () => {
    console.log(
      'Sending Http request for new character with id ' +
      props.selectedChar
    );
    setIsLoading(true);
    fetch('https://swapi.co/api/people/' + props.selectedChar)
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not fetch person!');
        }
        return response.json();
      })
      .then(charData => {
        const loadedCharacter = {
          id: props.selectedChar,
          name: charData.name,
          height: charData.height,
          colors: {
            hair: charData.hair_color,
            skin: charData.skin_color
          },
          gender: charData.gender,
          movieCount: charData.films.length
        };
        setLoadedCharacter(loadedCharacter);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  console.log('Rendering ...');

  useEffect(() => {           //run after render DOM
    fetchData();              //useEffect(() => {}, []) - if empty "[]" run only one like componentDidMount
    return () => {            //run always
      console.log('Cleaning up ...');
    };
  }, [props.selectedChar]);    // [props.selectedChar] - run if "props.selectedChar" changed (props or state)

  useEffect(() => {
    return () => {            //run only when close component
      console.log('Component did unmount');
    }
  }, []);

  let content = <p>Loading Character...</p>;

  if (!isLoading && loadedCharacter.id) {
    content = (
      <Summary
        name={loadedCharacter.name}
        gender={loadedCharacter.gender}
        height={loadedCharacter.height}
        hairColor={loadedCharacter.colors.hair}
        skinColor={loadedCharacter.colors.skin}
        movieCount={loadedCharacter.movieCount}
      />
    );
  } else if (!isLoading && !loadedCharacter.id) {
    content = <p>Failed to fetch character.</p>;
  }
  return content;
}

export default React.memo(Character);   //React.memo re-render component only when props change

// second argument (function) - if we want have more control, run if props are equal
// export default React.memo(Character, (prevProps, nextProps) => { 
//   return nextProps.selectedChar === prevProps.selectedChar;
// });
