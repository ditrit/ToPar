basedir=process.cwd()

classes = require(basedir + '/ToscaTypes.js').classes
app = require(basedir + '/topar.js');

describe("Tosca Compiler syntax -> ", function() {
	
  describe("properties : ", function() {

	it("The compiler should accept example of the normative doc",
		function() { expect( app.parse_string(`
  num_cpus:
    type: integer
    description: Number of CPUs requested for a software node instance.
    default: 1
    required: true
    constraints:
      - valid_values: [ 1, 2, 4, 8 ]
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });

	it("The compiler should property with no description",
		function() { expect( app.parse_string(`
  names:
    type: list
    entry_schema: string 
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });

	it("The compiler should accept property with entry_schema",
		function() { expect( app.parse_string(`
  names:
    type: list
    entry_schema: string
    required: false
    description: A list of names 
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });

	it("The compiler should accept property with list but no entry_schema",
		function() { expect( app.parse_string(`
  names:
      type: list
      description: Actual number of CPUs allocated to the node instance """))
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });

	it("The compiler should accept property with metadata",
		function() { expect( app.parse_string(`
  names:
      type: list
      metadata:
        un: deux
        trois: quatre
      description: Actual number of CPUs allocated to the node instance """))
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });
	
	it("The compiler should accept property with default",
		function() { expect( app.parse_string(`
  actual_cpus:
    type: integer
    default: 4
    description: Actual number of CPUs allocated to the node instance 
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });


	it("The compiler should accept property with constraints",
		function() { expect( app.parse_string(`
  actual_cpus:
    type: integer
    description: Number of CPUs requested for a software node instance
    default: 1
    required: true
    constraints:
      - valid_values: [1,2,4,8]
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });

	it("The compiler should accept a property with a correct status",
		function() { expect( app.parse_string(`
  names:
    type: list
    entry_schema: string
    status: experimental
    description: A list of names 
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });

	it("The compiler should accept property of type list with constraints",
		function() { expect( app.parse_string(`
  list1:
    type: list
    constraints:
      - min_length: 2
    entry_schema:
      type: integer
      description: tagada
      constraints:
        - less_than: 5
        - in_range: [2,10]
    status: experimental
    default:
      - 2
      - 3
      - 4
    required: true
    description: Number of CPUs requested for a software node instance
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });

	it("The compiler should accept a property with complex type, status, default value and constraint",
		function() { expect( app.parse_string(`
  list_of_names:
    type: list
    default:
      - tagada
      - tsointsoin
    constraints:
      - length: 2
    description: A list of names
    entry_schema:
      type: string
      description: tagada
      constraints:
        - min_length: 4
        - max_length: 10
    status: experimental
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });

	it("The compiler should not accept a property with bad status",
		function() { expect( app.parse_string(`
  list_of_names:
      type: list
      entry_schema: string
      status: experiment
      description: A list of names
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(false) });

	it("The compiler should accept multiple properties",
		function() { expect( app.parse_string(`
    names:
      type: list
      entry_schema: string
      status: supported
      description: A list of names
      required: true
    num_cpus:
      type: integer
      description: Actual number of CPUs allocated to the node instance
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });


	it("The compiler should accept multiple complex properties",
		function() { expect( app.parse_string(`
    names:
      type: list
      entry_schema: string
      status: deprecated
      description: A list of names
      required: true
    num_cpus:
      type: integer
      description: Number of CPUs requested for a software node instance
      default: 1
      required: true
      constraints:
        - valid_values: [1,2,4,8]
    list_int:
      type: list
      constraints:
        - min_length: 2
      entry_schema:
        type: integer
        description: tagada
        constraints:
          - less_than: 5
          - in_range: [2,10]
      status: experimental
      default:
        - 2
        - 3
        - 4
      required: true
      description: Number of CPUs requested for a software node instance
    map_string:
      description: une belle poesie
      type: map
      constraints:
        - min_length: 2
      entry_schema:
        type: string
        description: tagada
        constraints:
          - min_length: 3
          - max_length: 10
      default:
        un: tagada
        deux: pouet
        trois: pouet
        quatre: tsointsoin
      required: true
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });

	it("The compiler should accept property with multi-level complex type and default ",
		function() { expect( app.parse_string(`
  complexcollection:
    type: list
    entry_schema:
      type: map
      constraints:
        - min_length: 1
        - max_length: 3
      entry_schema:
        type: list
        entry_schema: string
        description: A list of names
    default:
      - equipe1:
          - alain.terrieur
          - alex.terrieur
        activites:
          - dev
          - ops
        locaux:
          - batimentA
      - bureaux:
          - a droite
          - en bas
        personnes:
          - lea.sambe
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });

	it("The compiler should accept property with a json schema constraint ",
		function() { expect( app.parse_string(`
  event_object:
    type: json
    constraints:
      - schema: >+
         {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "title": "Event",
          "description": "Example Event type schema",
          "type": "object",
          "p roperties": {
            "uuid": {
              "description": "The unique ID for the event.",
              "type": "string"
            },
            "code": {
            "type": "integer"
            },
            "message": {
              "type": "string"
            }
          },
          "required": ["uuid", "code"]
         }

`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });

	it("The compiler should accept property with a xml schema constraint ",
		function() { expect( app.parse_string(`
  event_object:
    type: xml
    constraints:
      - schema: >
          <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
            targetNamespace="http://cloudplatform.org/events.xsd"
            xmlns="http://tempuri.org/po.xsd" elementFormDefault="qualified">
            <xs:annotation>
              <xs:documentation xml:lang="en">
                Event object.
              </xs:documentation>
            </xs:annotation>
            <xs:element name="eventObject">
              <xs:complexType>
                <xs:sequence>
                  <xs:element name="uuid" type="xs:string"/>
                  <xs:element name="code" type="xs:integer"/>
                   <xs:element name="message" type="xs:string" minOccurs="0"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
          </xs:schema>
`, 'properties' ) instanceof classes.ToscaProperties).toEqual(true) });
	

  });

});
