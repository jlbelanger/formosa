# Formosa

A [React](https://www.npmjs.com/package/react) form component library. It works well with [JSON:API](https://jsonapi.org/), but it is not required.

## Demo

https://formosa.jennybelanger.com/

## Setup

This package isn't actually published, but if it was, you would run:

```bash
npm install --save @jlbelanger/formosa
# or
yarn add @jlbelanger/formosa
```

Your app must include the `<FormContainer>` component once (eg. in the main `App` component). All `<Form>`s must be inside this container.

```jsx
import { Field, FormContainer, Form, Submit } from '@jlbelanger/formosa';
import React from 'react';

export default function App() {
	return (
		<main>
			<header>
				<h1>Formosa Example</h1>
			</header>

			<FormContainer>
				<Form>
					<Field label="Username" name="email" type="email" />
					<Field label="Password" name="password" type="password" />
					<Submit />
				</Form>
			</FormContainer>
		</main>
	);
}
```

## Styles

By default, no styles are included. To include all styles (eg. in `src/index.scss`):

``` scss
@import '../node_modules/@jlbelanger/formosa/src/style';
```

To selectively include certain styles listed in the [components](https://github.com/jlbelanger/formosa/tree/master/src/scss/components) folder:

``` scss
@import '../node_modules/@jlbelanger/formosa/src/scss/utilities/variables';
@import '../node_modules/@jlbelanger/formosa/src/scss/components/checkbox';
```

A list of Sass variables is available in [_variables.scss](https://github.com/jlbelanger/formosa/blob/master/src/scss/utilities/_variables.scss).

## Components

### [Form](https://github.com/jlbelanger/formosa/blob/master/src/js/Form.js)

``` jsx
import { Form } from '@jlbelanger/formosa';
```

|Attribute   |Default |Notes|
|------------|--------|-----|
|row         |`{}`    |Default values for fields. For edit forms, the existing record's values should be specified here.|
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

### [Field](https://github.com/jlbelanger/formosa/blob/master/src/js/Field.js)

``` jsx
import { Field } from '@jlbelanger/formosa';
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
|type            |`'text'`  |Accepts any standard HTML type (eg. text, email, select, textarea) as well as 'has-many' and 'autocomplete'.|
|wrapperClassName|`''`      |     |

### [Submit](https://github.com/jlbelanger/formosa/blob/master/src/js/Submit.js)

``` jsx
import { Submit } from '@jlbelanger/formosa';
```

|Attribute |Default |
|----------|--------|
|label     |`'Save'`|
|prefix    |`null`  |
|postfix   |`null`  |

### [Label](https://github.com/jlbelanger/formosa/blob/master/src/js/Label.js)

``` jsx
import { Label } from '@jlbelanger/formosa';
```

|Attribute |Default |
|----------|--------|
|label     |`''`    |
|note      |`''`    |

### [Message](https://github.com/jlbelanger/formosa/blob/master/src/js/Message.js)

``` jsx
import { Message } from '@jlbelanger/formosa';
```

The `<Message>` component is included by default at the top of every `<Form>`. It displays success and error messages after the form is submitted. If you want to customize the position of the `<Message>`, you set `showMessage={false}` on the `<Form>` and include this component wherever you want messages to appear.
