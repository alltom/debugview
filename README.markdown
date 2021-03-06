# debugview

Language-agnostic debugging widgets based on print statements.

The idea is that you often use log statements while you're debugging, really lightweight stuff like `System.out.println("new value: " + val)` to make sure that your code does what you think it does. But because you print to a console, the "widgets" you can use are fairly primitive:

* **Notification / status indicator.** Example (JavaScript): `console.log('loading data...')`
* **List.** Example (Java): `list.stream().forEach(System.out.println)`
* **Table.** Example (OCaml): `List.iter (fun (a, b) -> print_endline (a ^ "\t" ^ b)) list`

debugview lets you add special commands to your log statements that give you easy access to a broader widget library:

* **HTML.** Example (C): `printf("<<<html <h2>Now the fun part...</h2> >>>\n");` adds a row to a table
* **(Aligned) Table.** Example (JavaScript): `console.log('<<<tr ' + fields.join('|') + '>>>')` adds a row to a table
* **Bar chart.** Example (JavaScript): `console.log('<<<bar ' + value + '>>>')` adds a bar to a bar chart

# Installation

    npm install -g debugview

# Usage: Language-agnostic

Just pipe your program through debugview. Your program's output will still show in the terminal, but it will launch a web browser that shows the same content with all the debugview commands interpreted as tables, bar charts, etc.

    $ yourprogram | debugview

If you want to see it go, try an example:

    $ node example01.js | debugview

# Usage: Browser JavaScript

Start debugview in remote mode:

    $ debugview --remote

It will print a `<script>` tag for you to insert in your page. When you load the page, debugview will open a new browser window to show the log in.

# The Future

debugview barely exists. I wrote just enough to convince myself it could work, so it's pretty hacky and under-documented. See `TODO.markdown` for things I'm planning.
