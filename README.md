# The Paranoid Android

A Discord bot for linking to SCP Wiki items.

Currently The Paranoid Android is not hosted anywhere officially. However, you can feel free to use and modify what I currently have here as long as it complies with the LICENSE.

The official bot account can still be invited by [clicking here](https://discord.com/api/oauth2/authorize?client_id=699167907254501457&permissions=19456&scope=bot).

## Disclaimer

The Paranoid Android's profile picture comes from Twitter's Twemoji project.

```
Copyright 2020 Twitter, Inc and other contributors
Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/
```

## Usage

This page aims to help you understand how to properly use The Paranoid Android to its fullest. Don't worry, it's a pretty simple bot and it's easy to use.

### Info & Commands

If you are interested in viewing information about the bot, you can mention the bot on its own or run:

```
./info
```

If you want to know what commands you can use with the bot, you can run:

```
./help
```

### SCP Wiki Listings

The Paranoid Android allows you to view articles from the SCP Wiki such as SCP items and tales. You can also view listings from the Canon Hub, SCP-001 proposals, Mobile Task Forces, and Groups Of Interest.

#### SCP Items

SCP items will be [automatically detected](/usage/#auto-linking) when you talk in a text channel as long as you haven't set yourself to be ignored. Setting yourself to be ignored only applies to the automatic detection and you can still use regular commands.

To set your ignore status run:

```
./ignore [on|off]
```

#### Wiki Articles

You can view an article that is on the SCP Wiki by running:

```
./article [title]
```

This can also be useful for very specific SCP articles that wouldn't be automatically detected because of their naming such as [SPC-1057-J](http://scp-wiki.net/spc-1057-j) and [MZL-1730](http://scp-wiki.net/mzl-1730). Please make sure that when you are entering the title for the article you are after that you correctly spell it otherwise the bot can't find it.

##### Why are certain things missing?

When the bot automatically detects SCP items it displays information which is not seen when running the article command such as the SCP series and the SCP title. This is purely because of how the SCP Wiki works and how we interact with it. When detecting SCP items the bot tries to determine what series the SCP is from and uses that information to get the series name and SCP title. If this were to be done with the article command as well as getting the article info it would take roughly twice as long and while this isn't too long I would rather reduce resource usage and increase performance.

#### SCP-001 Proposals

To view a list of the SCP-001 proposals you can run:

```
./scp001
```

#### Mobile Task Forces

To view a list of the Mobile Task Forces you can run:

```
./mtf
```

To view more information about a Mobile Task Force you can run:

```
./mtf [code]
```

Where the code is a greek letter follow by a number such as 'MTF **Mu-4** ("Debuggers")'. Example:

```
./mtf mu-4
```

#### Groups Of Interest

To view a list of Groups Of Interest you can run:

```
./goi
```

To view more information about a Group Of Interest you can run:

```
./goi [name]
```