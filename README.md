# Formosa

Formosa is a [React](https://www.npmjs.com/package/react) form component library. It works well with [JSON:API](https://jsonapi.org/), but it is not required. [View the demo](https://formosa.jennybelanger.com/).

## Features

- Allows accessing form values outside of the `<Form>` component
- Supports vertical forms (ie. labels above inputs) and horizontal forms (ie. labels beside inputs)
- Provides API helper class
- Displays toast messages (without additional library dependencies)
- Shows spinner automatically during API requests (using [react-promise-tracker](https://www.npmjs.com/package/react-promise-tracker))
- Excludes styles by default, so all styles can be completely customized; all elements have classes so they can be easily targeted
- Includes optional basic SCSS, if you don't want to spend time styling form elements *yet again*; uses SCSS variables that can be overridden
- Supports nested field names (eg. `name="foo.bar"`)

## Requirements

- [React](https://www.npmjs.com/package/react) 18+

## Install

**Warning: This package is still a work-in-progress. Use at your own risk.**

```bash
# With npm:
npm install --save https://github.com/jlbelanger/formosa

# Or with yarn:
yarn add https://github.com/jlbelanger/formosa
```

## Setup

Your app must include the `<FormContainer>` component once (eg. in the main `App` component). All `<Form>`s must be inside this container. The `<FormContainer>` does not take any props; it is used to display a spinner during API requests and to display toast messages when forms are submitted.

```jsx
import { Field, FormContainer, Form, Submit } from '@jlbelanger/formosa';
import React, { useState } from 'react';

export default function App() {
	const [row, setRow] = useState({});

	return (
		<main>
			<header>
				Formosa Example
			</header>

			<FormContainer>
				<Form row={row} setRow={setRow}>
					<Field label="Username" name="email" type="email" />
					<Field label="Password" name="password" type="password" />
					<Submit />
				</Form>
			</FormContainer>
		</main>
	);
}
```

### Styles

By default, no styles are included. To include all styles (eg. in `src/index.scss`):

``` scss
@import '@jlbelanger/formosa/src/style';
```

To selectively include specific styles listed in the [components](https://github.com/jlbelanger/formosa/tree/main/src/scss/components) folder:

``` scss
@import '@jlbelanger/formosa/src/scss/utilities/variables';
@import '@jlbelanger/formosa/src/scss/components/checkbox';
```

A list of Sass variables is available in [_variables.scss](https://github.com/jlbelanger/formosa/blob/main/src/scss/utilities/_variables.scss).

### Components

#### [Form](https://github.com/jlbelanger/formosa/blob/main/src/js/Form.js)

Each `<Form>` must have `row` and `setRow` props. Typically, these values will come from `const [row, setRow] = useState({});` in your own component. The `<Field>`s will update the `row` using `setRow`. That means that the original `row` and the values in the form are always in sync, so you can display or update the `row` yourself, and the `<Form>` will still contain the correct values.

``` jsx
import { Form } from '@jlbelanger/formosa';

// ----------------------------------------

// Minimal example:

<Form row={row} setRow={setRow} />

// Renders:

<form></form>

// ----------------------------------------

// Optional fields:

<Form
	/* Required */
	row={row}
	setRow={setRow}

	/* Optional (TODO: add other fields) */
	htmlId="foo"

	/* All other props are added to the form element */
	className="my-class-name"
	data-foo="example"
>
	Hello.
</Form>

// Renders:

<form class="my-class-name" data-foo="example" id="foo">
	Hello.
</form>
```

|Attribute   |Default |Notes|
|------------|--------|-----|
|row         |`{}`    |Required. Default values for fields. For edit forms, the existing record's values should be specified here.|
|setRow      |`null`  |Required. Function for updating row in state.|
|showMessage |`true`  |If true, the inline `<Message>` component will be included at the top of the form. Set this to `false` if you want to include the `<Message>` somewhere else.|
|htmlId      |`''`    |Since `id` is used for JSON:API, this attribute sets the `id=""` attribute on the form.|

The following attributes are for JSON:API forms only.

|Attribute          |Default |Notes|
|-------------------|--------|-----|
|method             |`null`  |Required for JSON:API requests. (eg. `PUT`, `POST`, `DELETE`)|
|path               |`null`  |Required for JSON:API requests. (eg. `users`)|
|id                 |`''`    |Required for JSON:API `PUT` and `DELETE` requests. (eg. `'123'`)|
|afterSubmit        |`null`  |Function to be called after a successful form submission.|
|clearOnSubmit      |`false` |If true, after a successful form submission, the data in the form will be replaced with `defaultRow`.|
|defaultRow         |`{}`    |For add forms, default values can be specified here. eg. `{ country: 'CA' }` You should specify the same values for `row` too (eg. to allow adding multiple records using the same form without reloading the page).|
|filterBody         |`null`  |Function to modify the request body before it is converted to JSON and sent to the API.|
|filterValues       |`null`  |Function to modify the form values before they are separated into attributes and relationships, converted to JSON, and sent to the API.|
|params             |`''`    |Additional query args to include in the API request. (eg. `include=user`)|
|preventEmptyRequest|`false` |If true, a toast message will appear if the user tries to save the form without making any changes.|
|relationshipNames  |`[]`    |If the form contains any inputs that control relationship values, this needs to be set to properly serialize the API request.|
|successMessageText |`''`    |Text to be shown in the `<Message>` component after a successful form submission. (eg. `Profile updated successfully.`)|
|successToastText   |`''`    |Text to be shown in a toast after a successful form submission. (eg. `Profile updated successfully.`)|

#### [Field](https://github.com/jlbelanger/formosa/blob/main/src/js/Field.js)

The `<Field>` component offers a simple way to display any kind of input along with the label, and it works well in horizontal forms.

If you don't want a horizontal form, or if you want more control over how the fields are displayed, you can use the `<Input>` and `<Label>` components instead (and possibly create your own `<Field>`-type component).

``` jsx
import { Field } from '@jlbelanger/formosa';

// ----------------------------------------

// Minimal example:

<Field label="Foo" name="bar" />

// Renders:

<div class="formosa-field formosa-field--bar">
	<div class="formosa-label-wrapper">
		<label class="formosa-label" for="bar">Foo</label>
	</div>
	<div class="formosa-input-wrapper formosa-input-wrapper--text">
		<input class="formosa-field__input" id="bar" name="bar" type="text" />
	</div>
</div>

// ----------------------------------------

// Optional fields:

<Field
	/* Required */
	label="Foo"
	name="bar"

	/* Optional (TODO: add other fields) */

	/* All other props are added to the input, select, or textarea element */
	className="my-class-name"
	data-foo="example"
/>

// Renders:

<div class="formosa-field formosa-field--bar">
	<div class="formosa-label-wrapper">
		<label class="formosa-label" for="bar">Foo</label>
	</div>
	<div class="formosa-input-wrapper formosa-input-wrapper--text">
		<input class="formosa-field__input my-class-name" data-foo="example" id="bar" name="bar" type="text" />
	</div>
</div>
```

|Attribute       |Default   |Notes|
|----------------|----------|-----|
|name            |N/A       |Required.|
|component       |`null`    |If none of the standard `type`s do what you need, use your own component.|
|id              |`null`    |If not specified, it will default to the value of `name`.|
|label           |`''`      |     |
|labelNote       |`''`      |     |
|labelPosition   |`'before'`|Alternately, `'after'`.|
|note            |`''`      |     |
|prefix          |`null`    |     |
|postfix         |`null`    |     |
|suffix          |`null`    |     |
|type            |`'text'`  |Accepts any standard HTML type (eg. text, email, file, select, textarea) as well as 'autocomplete'.|
|wrapperClassName|`''`      |     |

#### [Submit](https://github.com/jlbelanger/formosa/blob/main/src/js/Submit.js)

The `<Submit>` component offers a simple way to display the submit button in a horizontal form.

If you aren't using a horizontal form, or if you want more control over how the submit button is displayed, you can use a regular old `<button type="submit">Submit</button>`; as long as it is inside the `<Form>`, it will work. (Or, to display the button outside the `<Form>`, you can give the `<Form>` a `htmlId` prop, and add `form="whatever-the-htmlId-is"` to the `<button>`).

``` jsx
import { Submit } from '@jlbelanger/formosa';

// ----------------------------------------

// Minimal fields:

<Submit label="Login" />

// Renders:

<div class="formosa-field formosa-field--submit">
	<div class="formosa-label-wrapper formosa-label-wrapper--submit"></div>
	<div class="formosa-input-wrapper formosa-input-wrapper--submit">
		<button class="formosa-button formosa-button--submit" type="submit">Login</button>
	</div>
</div>

// ----------------------------------------

// Optional fields:

<Submit
	/* Required */
	label="Login"

	/* Optional */
	prefix="Click here to"
	postfix={<a href="/forgot-password">Forgot your password?</a>}

	/* All other props are added to the button element */
	className="my-class-name"
	data-foo="example"
/>

// Renders:

<div class="formosa-field formosa-field--submit">
	<div class="formosa-label-wrapper formosa-label-wrapper--submit"></div>
	<div class="formosa-input-wrapper formosa-input-wrapper--submit my-class-name">
		Click here to
		<button class="formosa-button formosa-button--submit my-class-name" type="submit" data-foo="example">Login</button>
		<a href="/forgot-password">Forgot your password?</a>
	</div>
</div>
```

|Attribute |Default   |Notes|
|----------|----------|-----|
|label     |`'Submit'`|     |
|prefix    |`null`    |Text/HTML displayed before the button.|
|postfix   |`null`    |Text/HTML displayed after the button.|

#### [Label](https://github.com/jlbelanger/formosa/blob/main/src/js/Label.js)

The `<Label>` component offers a simple way to display field labels by adding a few extra classes to help with styling (eg. `formosa-label--required` for required fields). This component is included in the `<Field>` component, so if you are using `<Field>`, you don't need this component.

``` jsx
import { Label } from '@jlbelanger/formosa';

// ----------------------------------------

// Minimal fields:

<Label label="Foo" />

// Renders:

<div class="formosa-label-wrapper">
	<label class="formosa-label">Foo</label>
</div>

// ----------------------------------------

// Optional fields:

<Label
	/* Required */
	label="Foo"

	/* Optional */
	note="Lorem ipsum."

	/* All other props are added to the label element */
	className="my-class-name"
	data-foo="example"
/>

// Renders:

<div class="formosa-label-wrapper">
	<label class="formosa-label my-class-name" data-foo="example">Foo</label>
	<span class="formosa-label__note">Lorem ipsum.</span>
</div>
```

|Attribute |Default |Notes|
|----------|--------|-----|
|label     |`''`    |     |
|note      |`''`    |Text/HTML displayed after the label.|

### [Message](https://github.com/jlbelanger/formosa/blob/main/src/js/Message.js)

The `<Message>` component displays success and error messages after the form is submitted. This component is included at the top of the `<Form>` component, so if you are using `<Form>`, you don't need this component.

However, if you want to customize the position of the `<Message>`, set `showMessage={false}` on the `<Form>` and include this component as a child of the `<Form>` wherever you want messages to appear.

``` jsx
import { Message } from '@jlbelanger/formosa';

// ----------------------------------------

// Example:

<Message />

// When there are errors, renders:

<p className="formosa-message formosa-message--error">Foo.</p>

// Where there is a success message, renders:

<p className="formosa-message formosa-message--success">Foo.</p>

// ----------------------------------------

// To customize the position of the messages:

import { Field, Form, Message, Submit } from '@jlbelanger/formosa';

<Form showMessage={false}>
	<h1>Add user</h1>
	<Message />
	<Field label="Username" name="username" />
	<Submit />
</Form>
```

## Examples

- [Glick](https://github.com/jlbelanger/glick-app)
- [Food Tracker](https://github.com/jlbelanger/food-app)
- [Crudnick](https://github.com/jlbelanger/crudnick)
	- [Corrieography Admin](https://github.com/jlbelanger/corrie-admin)
	- [Jenny's Wardrobe Admin](https://github.com/jlbelanger/wardrobe-admin)

## Development

### Requirements

- [Git](https://git-scm.com/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

### Setup

``` bash
# Clone the repo
git clone https://github.com/jlbelanger/formosa.git
cd formosa

# Install dependencies
yarn install
cd example
yarn install
```

### Run

``` bash
yarn start

# In a new window:
cd example
yarn start
```

Your browser should automatically open http://localhost:3000/

### Lint

``` bash
yarn lint
```

### Test

``` bash
yarn test
```

## Deployment

Note: The deploy script included in this repo depends on other scripts that only exist in my private repos. If you want to deploy this repo, you'll have to create your own script.

``` bash
./deploy.sh
```
