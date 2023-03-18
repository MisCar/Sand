# Usage

This should give you an in-depth look at using everything available in Sand.

## Basic Usage

Use the edit mode (by clicking on the paintbrush icon) to add new widgets and tabs.

<img width="84" alt="Screenshot 2023-03-18 at 19 18 46" src="https://user-images.githubusercontent.com/63877260/226122666-d5381a13-c3d1-43e5-9b72-de9017fece64.png">

Each tab has a fixed number of columns and you can further customize grid size in the Tab panel.

<img width="267" alt="Screenshot 2023-03-18 at 19 19 19" src="https://user-images.githubusercontent.com/63877260/226122682-2193026f-8212-4306-aa59-6bf4c361447f.png">

You can add new widgets either by dragging them from the Widgets panel or by dragging keys from the NetworkTables panel (which is visible only when connected to a robot).
You can remove widgets by clicking on the trash icon in their top left corner, and modify them by pressing on the pencil icon in their top right corner.

<img width="434" alt="Screenshot 2023-03-18 at 19 20 09" src="https://user-images.githubusercontent.com/63877260/226122728-b55efb8d-844d-4ea3-8fc4-42d9a8a66ba8.png">

Notice the indication around the widget showing you which widget you are currently modifying.
You can also drag widgets around and resize them using the handle in their bottom right corner.

In each widgets' modify panel, you can edit its title, type, NetworkTables source and further widget-specific options.

<img width="259" alt="Screenshot 2023-03-18 at 19 20 45" src="https://user-images.githubusercontent.com/63877260/226122756-5bf57030-32b2-42f9-80c6-5d58d3554159.png">

Most advanced features include browsing files in the app's directory which you can see by opening the App Settings panel in the Edit mode.
You can also pick a Theme Color to make the app fit your teams' color scheme. Use any hex color, like `#7e0c2b`, click Save and restart Sand.

<img width="259" alt="Screenshot 2023-03-18 at 19 21 30" src="https://user-images.githubusercontent.com/63877260/226122840-7a3377fe-e3b4-4fbc-bbdc-3bbd47d43b88.png">

You can save your schemas in the JSON format and then open them from another computer and save them there.
The Save action stores your current schema in the app's directory (which will be opened whenever you open Sand), and you can use Save As to transfer your schema around.

## Drivers

Use the lock button in the bottom left corner to lock the window to the correct resolution with regard to the Driver Station and keep the window on top.

You can still interact with widgets and switch tabs, but you won't be able to resize or drag widgets.

## Controlling Sand through the Robot

You can use the following NetworkTables entries to control Sand:

- Shuffleboard's builtin methods to add widgets to tabs
- Modify `/Sand/ActiveTab` to change the tab from the robot. This should be a string of the tab's index, i.e. "0","1", etc.
- Modify `/Sand/Sound` to play sounds, as explained [here](#playing-sounds).

## Keyboard Shortcuts

In the Keyboard Shortcuts panel in the Edit mode, click New Shortcut to add a new shortcut. Pick a shortcut like `ctrl+shift+f` and bind it to a NetworkTable 
boolean entry using the NT Key column. You can pick either the Set True mode which sets the entry to true when the keyboard shortcut occurs, or Flip mode which
flips its value (alternates between true and false). Use the trash icon to delete a keyboard shortcut.

## Playing Sounds

You can play sound by storing mp3 files in the app directory under a subdirectory called exactly "sounds".
For example, store a file called `fun.mp3` in said directory and set `/Sand/Sound` to the string value `"fun"`. You should here your sound file.

## Custom Team Logo

Everything in Sand uses JSON as the schemas
You can add your team's logo to be in the app's sidebar by editing your `settings.json` file and adding an `"icon"` field with a string value of a base64-encoded image.
