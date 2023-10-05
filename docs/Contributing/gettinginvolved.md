<img src="https://i.imgur.com/oi5NwOp.png" alt="Lets Go"> </img>

## How

Paradox is an open source project, it has been maintained and developed by multiple members over the few years. We welcome all who wish to be a part of the project once you have setup your development environment feel free to send a PR request or have a chat with either myself or Visual1mpact via the discord support server.

## TypeScript

Paradox is written in TypeScript, TypeScript is an extension of JavaScript that allows for more strict and structured coding, whereas JavaScript is more flexible and forgiving. TypeScript is designed to help developers write more reliable and maintainable code, but requires more strict adherence to coding standards. JavaScript is often used for rapid prototyping and quick development, while TypeScript is better suited for larger, more complex projects where the benefits of type checking and strict coding outweigh the added complexity.

JavaScript is a dynamic, interpreted language that is used to create interactive elements. TypeScript is a superset of JavaScript that adds features such as static typing, which can help catch errors before the code is run. This is extremely useful in a Minecraft environment as it saves a developer a lot of time having to load a world to debug blocks of code that Typescript can normally catch right then and there before even getting that far.

## Development Environment Setup

The following guide will help you setup a local development environment once complete you will be able to edit paradox make changes and submit pull requests.

## Installing Visual Studio Code (VSC)

<ol>
  <li>Install Visual Studio Code (VSC) from the official website: <a href="https://code.visualstudio.com/">https://code.visualstudio.com/</a></li>
  <li>Install the latest Node.js version from the official website: <a href="https://nodejs.org/">https://nodejs.org/</a></li>
</ol>

## Forking the repository.

<ol>
  <li>Fork the project repository by clicking on the "Fork" button in the top-right corner of the repository page: <a href="https://github.com/Pete9xi/Paradox_AntiCheat">https://github.com/Pete9xi/Paradox_AntiCheat</a></li>
  <li>Clone the forked repository to your local machine using the built-in terminal of Visual Studio Code:</li>
</ol>
<pre><code>git clone https://github.com/&lt;your-github-username&gt;/Paradox_AntiCheat.git
</code></pre>

<ol start="3">
  <li>Navigate to the cloned project directory using the built-in terminal of Visual Studio Code:</li>
</ol>

<pre><code>cd Paradox_AntiCheat
</code></pre>

<ol start="4">
  <li>Install project dependencies using the built-in terminal of Visual Studio Code:</li>
</ol>

<pre><code>npm i
</code></pre>

## Building for Development.

<ul>
  <li>To build the project for development on Linux, run the following command in the built-in terminal of Visual Studio Code:</li>
</ul>

<pre><code>npm run build
</code></pre>

<ul>
  <li>To build the project for development on Windows, use the following command in the built-in terminal of Visual Studio Code:</li>
</ul>

<pre><code>npm run build_win
</code></pre>

## Making and Committing Changes

<ol>
  <li>Make changes to the project files using Visual Studio Code.</li>
  <li>Save the files.</li>
</ol>

## Committing Changes to Git

<ol>
  <li>Stage the changes to include all modifications in the built-in terminal of Visual Studio Code:</li>
</ol>

<pre><code>git add .
</code></pre>

<p>(Alternatively, use <code>git add &lt;filename&gt;</code> to stage specific files.)</p>

<ol start="2">
  <li>Commit the changes with a meaningful commit message in the built-in terminal of Visual Studio Code:</li>
</ol>

<pre><code>git commit -m "Your commit message here"
</code></pre>

## Pushing Commits Upstream

<ol>
  <li>Before pushing, pull any changes from the original repository to avoid conflicts in the built-in terminal of Visual Studio Code:</li>
</ol>

<pre><code>git pull origin main
</code></pre>

<p>(This ensures your fork is up to date with the original repository.)</p>

<ol start="2">
  <li>Push the committed changes to your forked repository on GitHub in the built-in terminal of Visual Studio Code:</li>
</ol>

<pre><code>git push origin main
</code></pre>

## Creating a Pull Request

<ol>
  <li>Go to your forked repository on GitHub: <a href="https://github.com/&lt;your-github-username&gt;/Paradox_AntiCheat">https://github.com/&lt;your-github-username&gt;/Paradox_AntiCheat</a></li>
  <li>Click on the "Compare &amp; pull request" button.</li>
  <li>Review the changes in the pull request and provide a meaningful description of your changes.</li>
  <li>Click on the "Create pull request" button to submit the pull request to the original repository.</li>
</ol>

<p>Congratulations! You have successfully set up the development environment, cloned the project, built it for development, made changes, committed those changes, pushed them upstream, and created a pull request to contribute your changes back to the original repository.</p>

?>Please note that the project maintainers will review your pull request, and if they find it suitable, they will merge it into the main project. Keep an eye on your pull request for any feedback or updates from the maintainers.

<p>Happy contributing to the Paradox AntiCheat project! If you have any further questions or need additional assistance, feel free to ask.</p>
