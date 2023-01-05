# VDO.ninja-wrapper - DEVCERT help

This is a guide orientated towards developers who are wanting to spin up their own locally hosted version of VDO.ninja-wrapper, specifically working with devcert.

## The Problem:

Centerally, the developement version runs off of a simple node server on localhost. The challenge is that WebRTC (used in vdo.ninja) throws a tantrum if there is the slightest hint of not-SSL, and so a self-signed SSL is required. Furthermore, vdo.ninja (because of an issue with chrome) is limited specific domains for which pages can access the video frames of vdo.ninja guests from (1). And so when developing on Windows (I have not worked with macOS), one needs to add a custom domain to their HOSTS file. Thats a lot, however I am utilizing devcert which will eleviate those issues, so lets get into it.

## What does Devcert do?

> Devcert is a npm package installed and ran inside VDO.ninja-warpper's node server. See it's GitHub [here](https://github.com/davewasmer/devcert).

Devcert creates both a Certificate Authority (CA) on the computer as well as a specific SSL Certificate for the domain "test.vdo.ninja" which is specified by the Node server. The certificate authority as well as the HOSTS componants of this does mean that running **this system might linger after you remove the direct workspace & files of the VDO.ninja-wrapper**. However, for developement this is significantly midigates the work to get vdo.ninja-wrapper up and running, and so I chose to include it. And when you want to remove devcert, I have layed out the commands to remove it [below](#Removing-Devcert).

## **Starting the Server:**

> If you are wanting to see description of how to get to this point, read the full "How to Deploy" document [here]().

### **Devcert**

When starting the node server, devcert will prompt you with needing to create a password. This is a password for the device's devcert CA, which you will need to use if you are ever creating a new domain with devcert. In this case, you should only need to enter this once.

```
devcert password (http://bit.ly/devcert-what-password?): {your password}
```

- For macOS, I belive it won't prompt you for a password, [see here](https://github.com/davewasmer/devcert#security-concerns). I can't test to confim this, so report back about the process for that if you try it. :D

If Devcert was unable to automatically configure the certificate in firefox, it might then prompt you to then "launch the Firefox wizard". This will install the certificate in firefox, however, I don't choose to do this as vdo.ninja-wrapper required chrome to work. So I simply skip it (or it just doesn't operate properly, eitherway, I click **enter** and it doesn't add it to firefox).

Now you have a server perked up with SSL, and you are done with devcert! You shouldn't hear anything from devcert when starting up the server in the future. You can go to [`https://test.vdo.ninja`](https://test.vdo.ninja) and you should see the local VDO.ninja-wrapper on the page. 

If the page says *"This site can’t be reached"* or *"Your connection is not private"*, then the HOSTS file was not edited automatically by devcert, go on to the HOSTS section and that will be fixed.

### **HOSTS**

This is very simple, go to `C:\Windows\System32\drivers\etc\hosts`, and open it in your editor of choice.

It should look like this:
```
# Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# This file contains the mappings of IP addresses to host names. Each
# entry should be kept on an individual line. The IP address should
# be placed in the first column followed by the corresponding host name.
# The IP address and the host name should be separated by at least one
# space.
#
# Additionally, comments (such as these) may be inserted on individual
# lines or following the machine name denoted by a '#' symbol.
#
# For example:
#
#      102.54.94.97     rhino.acme.com          # source server
#       38.25.63.10     x.acme.com              # x client host

# localhost name resolution is handled within DNS itself.
#	127.0.0.1       localhost
#	::1             localhost
127.0.0.1  test.vdo.ninja 
```
You just need to add `127.0.0.1  test.vdo.ninja` to the file, as that points test.vdo.ninja locally on the device towards the localhost, which is where the Node server is serving files from. Finally, it will prompt you to save it as administrator, and so you will need to.

Now you should be able to go to [`https://test.vdo.ninja`](https://test.vdo.ninja) and see the local VDO.ninja-wrapper on the page. 

## **Removing Devcert:**

To remove the lingering Certificate Authority (CA), as well as the HOSTS changes, there are a few simple steps:

### **CA Removal**

> To see the source of these commands, see [here](https://github.com/davewasmer/devcert/issues/40#issuecomment-542924102).

First open your Windows Powershell.

1. Type in the first command to remove the trust for the certificate.
```
# Say yes to the prompt when it asks you if you want to delete
Get-ChildItem cert:\CurrentUser\Root |?{ $_.Subject -like '*devcert*' } |Remove-Item
```
2. The next step is to remove it completely is to type the second command into powershell.
```
Remove-Item -Force -Recurse "$ENV:LOCALAPPDATA\devcert"
```
3. Finally, if you installed the certificate into Firefox, you will need to remove it from there manually. So go to the menu in the top right -> settings -> Privacy & Security. All the way at the bottom is "View Certificates...", Open that. Then go to the Authorities tab, and find "devcert" in the list. Click "Delete or Distrust".

### **HOSTS Changes Removal**

This is really the inverse of the steps for editing the host file from above.

Go to `C:\Windows\System32\drivers\etc\hosts`, and open it in your editor of choice. Then remove `127.0.0.1  test.vdo.ninja` from the file. And when saving it will prompt you to save it as administrator, you will need to do so.

> **Updated 12/27/22**