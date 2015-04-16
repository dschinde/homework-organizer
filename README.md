# homework-organizer
A homework organizer for mobile devices

# Git

## Getting changes
	git pull

## Pushing changes
	git add .
	git commit -m "msg"
	git push origin master


# Ionic View
* Download the Ionic View app from the App Store

* Create an Ionic View account

* Upload your app by using `ionic upload` in your app directory
  
# Code

## Swipe Navigation

    <ion-view>
        <ion-nav-buttons></ion-nav-buttons>
        <hwo:swipe hwo:direction="<direction>" hwo:sref="<sref>" />
        <ion-content>
        
There can be multiple instances of `hwo:swipe` on any given template, but only one for each value of `hwo:direction`.

`hwo:direction` specifies the swipe direction and can be `up`, `down`, `left`, or `right`.

`hwo:sref` specifies what state to transition to. It takes exactly the same argument as `ui-sref` would.