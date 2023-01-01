# VDO.ninja-wrapper HISTORY

Although popping up on github on Dec. 25, 2022, the VDO.ninja wrapper project has been built by Andrew localy since June 7, 2022.
There have been many itterations during that time, totaling 2 main redesigns, and around 11 smaller modification stages.

> NOTE: At the time of writing this, I have just started transitioning to a new github versioning scheme which may be different from my local one. So currently, I am on v2.6-mix of v1.1 -> 1.6-mix.
2.6

## Pre-v1

This was the primary jumping off point for the project. It began with some rough block-out images of a possible redesign of the VDO.ninja. These were crude, but showed the range of changes that I was aiming for relative to the current VDO.ninja directors page.



## V1


At this point, this was just a mockup of the images I had designed before. I want to highlight the multi-room structure on one page, that is something I saw as important and would be a big improvement.

There are things that I have kept with the project throrucially I designed a Modal script and styling that has grown with me to at least v2.6. As well, some of the UI elements such as the toggle switches have been kept to v2.6.

[Check V1 out here](https://vdo-director-v1-1.netlify.app/ "V1.1 in place for V1").

## V2

This was a large update to most everything about the design. Things changed include:
- Updated/added the settings inputs for the **toggle switch**, **slider input**, and **slider preset-pills**. Also added an actual settings menu... :D

  The slider design was heavily inspired from Viesturs Marnauza, and their design [here](https://codepen.io/viestursm/pen/BayEjaN "Thank you man!").
- Mid-darkmode scheme for the UI. This was more for higherarche more than good looks, but still worthy of a bullet point.
- The multi-track structure of rooms, views (aka scenes), and groups. 

  This was a shortcoming of v1, and aimed to make different viewable lists of people (and controls) for each group, scene, and room. This put more emphasis on the structure than the people, with people being put in catagorie(s) for each track. Which is different from VDO.ninja, where it (currently) has scenes and groups selected per person, and doesn't have support for multiple rooms.


As well, at this point, I had concluded more about how I would end up developing the code for this, with it mainly being constructed my own, outside of the direct ecosystem of vdo.ninja developers. That is a bit of a lie, as notibly @steve and @Sam MacKinnon on discord have helped with technical knollege of interacting with the VDO.ninja IFrame API as well as front-end help in the visual desgin. Furthermore, in lue of being fair, Steve has described vdo.ninja as being (at least for a portion of the time) mostly developed by him directly, just with input from others for requests... so there isn't much of a developer base to pull from. However, in the future I am aiming to get more contributers and developers on this project.

*I uploaded this under v2.1 in the URL, not v2. It was a while ago, don't ask me...* \\_(\*o*)_/

[Check V2 out here](https://vdo-director-v2-1.netlify.app/ "V2.1 in place for V2").

## V2.2-main

Not as big a visual jump as v1 to v2, however, I did a lot of work in the back-end that isn't visible. For this version I worked mostly on the settings menu, creating my proSettings.js library/script which I am not using as of 2.3 -> 2.6, however it _will_ be there once the Settings UI is reinstated.

Furthermore, I also added the UI for the text input. I improved upon the basic design by adding a "previously used" option to the right of it. This would be a nice-to-have but would, right along with the slider preset pills, make it easyer for directors.

[Check V2.2 out here](https://vdo-director-v2-2.netlify.app/ "V2.2").

## V2.2-iframe
Concurrently to V2.2-main, I began contructing the back-end of the site, particularly trying to figure out the complexities of the IFrame API, in a seperate branch: x.x-iframe. Although I only had one version (v2.2) of this because of it reduced complexity from a full front-end UI. I itterated alot, but didn't feel I needed seperate versions as it was simple enough not delete things I might want later and I wasn't able to publish it to the public.

As for mensioned, this branch couldn't be shared publicly like the front-end was. In this case, I had to self sign an SSL certificate for WebRTC to function (it dies at even the hint of anything not being secure!). As well, I had to spin up a node server to serve the files through the SSL, and so I didn't find it worth it to set all that up simply to show that I could pull the video feed from and Iframe. :D


## V2.3-main


## V2.4-main


## V2.4-main


## V2.6-main


