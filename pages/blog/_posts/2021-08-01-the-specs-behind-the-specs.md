---
layout: blogpost
permalink: /the-specs-behind-the-specs-part-1
title: The specs behind the specs part 1
date: 2021-08-01
tags: telco ASN.1 dia
author: <a href="https://www.linkedin.com/in/sebastian-weddmark-olsson/">Sebastian Weddmark Olsson</a>, Telco newb
---


This will *probably* be a two piece blog post. I'll start with ASN.1
in this very long post and then sometime later go over the Diameter
dictionary specifications.

There might be some Erlang specific paragraphs here and there, but
this blog post is mainly about ASN.1 as a specification.

# Abstract Syntax Notation version One

Abstract Syntax Notation version One (ASN.1 for short) provides a
high level description of messages. It abstracts the language
implementations from the protocol design.

It was initially used by OSI to describe email messages but are used
by many other applications especially within telecommunications and
cryptography.

You might have heard of similar such abstract syntax notations used
for interface definitions such as Google Protocol Buffers, or
Facebook's Apache Thrift, but those languages have not managed by a
standardization organ, so the owning corporations could (in theory) do
breaking changes or change the license or even remove the definition
languages overnight.

Anyway, back to ASN.1

The first ASN.1 standardization came out 1984, and there have been
many improvements since, for instance with the 1994 update which added
extended functionality for telecommunication technologies.

"Long live ASN.1!" - Olivier Dubuisson from the [best
book](https://www.oss.com/asn1/resources/books-whitepapers-pubs/asn1-books.html#dubuisson)
that I've read on the subject. (How many ASN.1 books are there you
might wonder? Actually there were [more
books](https://www.oss.com/asn1/resources/books-whitepapers-pubs/asn1-books.html)
than I expected on the subject, but to make it perfectly clear: I only
read the one.)

Off-topic but a bit of a fun fact I got from reading the book which I
didn't know about before is that 'little Endian' and 'big Endian',
which are used to denote if the bitstring should be read from leftmost
or rightmost bit, actually originates from the 1726 best-seller
[Gulliver's
travels](https://www.ling.upenn.edu/courses/Spring_2003/ling538/Lecnotes/ADfn1.htm).

## The how and why

ASN.1 builds on the following ideas:

- Data structures to be transmitted should be described regardless of
  programming language used transmitting or receiving them.
- The notation should allow building complex data types from basic
  types, and be able to do so recursively.
- The notation must be formal to prevent ambiguities.

That said, ASN.1 is not an abstract syntax in itself, but a language
to describe abstract syntaxes.

There are currently four main ASN.1 specifications, as well as at least one
specification per encoding rule. I've listed them all below for easy access.


| ITU-T no                                                                               | ASN.1 specifications                                                                                    |
|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| [X.680](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.680) | Information technology - Abstract Syntax Notation One (ASN.1): Specification of basic notation          |
| [X.681](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.681) | Information technology - Abstract Syntax Notation One (ASN.1): Information object specification         |
| [X.682](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.682) | Information technology - Abstract Syntax Notation One (ASN.1): Constraint specification                 |
| [X.683](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.683) | Information technology - Abstract Syntax Notation One (ASN.1): Parameterization of ASN.1 specifications |

| ITU-T no                                                                               | Specifications for encoding rules                                                                                                                                 |
|----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [X.690](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.690) | Information technology - ASN.1 encoding rules: Specification of Basic Encoding Rules (BER), Canonical Encoding Rules (CER) and Distinguished Encoding Rules (DER) |
| [X.691](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.691) | Information technology - ASN.1 encoding rules: Specification of Packed Encoding Rules (PER)                                                                       |
| [X.692](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.692) | Information technology - ASN.1 encoding rules: Specification of Encoding Control Notation (ECN)                                                                   |
| [X.693](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.693) | Information technology - ASN.1 encoding rules: XML Encoding Rules (XER)                                                                                           |
| [X.694](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.694) | Information technology - ASN.1 encoding rules: Mapping W3C XML schema definitions into ASN.1                                                                      |
| [X.695](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.695) | Information technology - ASN.1 encoding rules: Registration and application of PER encoding instructions                                                          |
| [X.696](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.696) | Information technology - ASN.1 encoding rules: Specification of Octet Encoding Rules (OER)                                                                        |
| [X.697](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.697) | Information technology - ASN.1 encoding rules: Specification of JavaScript Object Notation Encoding Rules (JER)                                                   |

| ITU-T no                                                                               | Deprecated ASN.1 specifications                                                            |
|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| [X.208](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.208) | [Withdrawn] Specification of Abstract Syntax Notation One (ASN.1)                          |
| [X.209](https://www.itu.int/rec/T-REC-X/recommendation.asp?lang=en&parent=T-REC-X.209) | [Withdrawn] Specification of Basic Encoding Rules for Abstract Syntax Notation One (ASN.1) |

# Nitty gritty

## Modules

The purpose of an ASN.1 module is to name a collection of types and/or
value definitions.

It consist of a module reference and an optional object identifier
together with the declaration of the `DEFINITIONS` type definition.
Note that even though the object identifier is optional, it is
considered bad practice to leave it out. The reason for it being
optional is for backward compatibility; it was not part of the
original ASN.1 specification.
The `DEFINITIONS` keyword usually comes together with the `BEGIN` and
`END` keywords so multiple definitions can be done. (What else is the
point of a module if not to make a collection...).

The Erlang ASN.1 compiler requires each module to be in a separate
file, but generally one ASN.1 file could contain many modules.  Usual
file endings are `.asn` and `.asn1`. One
[trick](https://www.erlang.org/doc/apps/asn1/asn1_getting_started.html#multi-file-compilation)
that can be used to circumvent this Erlang specific problem is to list
multiple ASN.1 files in a new file ending with `set.asn`.

One example of a file with many modules exist in the CAP specification
[ETSI 129.078](https://www.etsi.org/deliver/etsi_ts/129000_129099/129078/16.00.00_60/)

The ASN.1 template for a module
```
ModuleReference ObjectIdentifier
DEFINITIONS ::= BEGIN

END
```
as seen in an example
```
CAP-operationcodes {itu-t(0) identified-organization(4) etsi(0) mobileDomain(0) umts-network(1) 
modules(3) cap-operationcodes(53) version8(7)}

DEFINITIONS ::= BEGIN
```

For information about the object identifier see the [types section](#object-identifier)

### Importing from other modules

Importing types, values and other structures from other modules can be
done with the `IMPORTS` and `FROM` keywords in the beginning of the
module body.  The `IMPORTS` keyword ends with a single semicolon `;`,
and the different imported definitions are comma-separated.

The meaning of the optional `IMPLICIT TAGS` keywords I'll handle
[later](#automatic-implicit-explicit-tags).

```
CAP-datatypes {itu-t(0) identified-organization(4) etsi(0) mobileDomain(0) umts-network(1) modules(3) cap-datatypes(52) version8(7)}
DEFINITIONS IMPLICIT TAGS ::= BEGIN

IMPORTS

	Duration,
	Integer4,
	Interval,
	LegID,
	ServiceKey
FROM CS1-DataTypes {itu-t(0) identified-organization(4) etsi(0) inDomain(1) in-network(1)
modules(0) cs1-datatypes(2) version1(0)}

	BothwayThroughConnectionInd,
	CriticalityType,
	MiscCallInfo
FROM CS2-datatypes {itu-t(0) identified-organization(4) etsi(0) inDomain(1) in-network(1)
cs2(20) modules(0) in-cs2-datatypes(0) version1(0)}

-- ...more imports...
; -- IMPORTS end here

END -- CAP-datatypes ends here --

-- CAP-errortypes module starts here --
CAP-errortypes {itu-t(0) identified-organization(4) etsi(0) mobileDomain(0) umts-network(1) modules(3) cap-errortypes(51) version8(7)}
DEFINITIONS IMPLICIT TAGS ::= BEGIN


END -- CAP-errortypes ends here --
```

The type definitions `Duration` and `LegID` above are imported from
`CS1-DataTypes` module, while `MiscCallInfo` comes from
the `CS2-datatypes` module.

### Exporting from a module

Exports from a module are done in a similar fashion.

If the `EXPORT` keyword is not used in a module, the ASN.1 compilers
should export all values and types from the module. It's the same as
specifying `EXPORTS ALL;`.

```
CAP-GPRS-ReferenceNumber {itu-t(0) identified-organization(4) etsi(0) mobileDomain(0)
umts-network(1) modules(3) cap-dialogueInformation(111) version8(7)}

DEFINITIONS ::= BEGIN

EXPORTS
	id-CAP-GPRS-ReferenceNumber,
	cAP-GPRS-ReferenceNumber-Abstract-Syntax;

IMPORTS

	Integer4
FROM CS1-DataTypes {itu-t(0) identified-organization(4) etsi(0) inDomain(1) in-network(1)
modules(0) cs1-datatypes(2) version1(0)}
;

END
```

### Commenting

As can be seen in the above example one can enter comments into the
ASN.1.  Comments starts with double dash `--` and ends with either a
newline or another `--`, whichever comes first.

## Assignments and naming

The rules specify that type references must start with an uppercase
letter and may not end with a dash `-`. It must also only contain
upper- and lower-case letters, digits or dashes `-`.  The syntax for a
type assignment is

```
TypeRef ::= TypeDefinition
```

For instance
```
InvokeIdType ::= INTEGER (-128..127)

CancelArg ::= CHOICE {
    invokeID        [0] InvokeID,
    allRequests     [1] NULL
}

Duration ::= INTEGER (-2..86400)

Integer4 ::= INTEGER (0..2147483647)

Interval ::= INTEGER (-1..60000)

InvokeID ::= InvokeIdType

LegID ::= CHOICE {
    sendingSideID   [0] LegType,
    -- used in operations sent from SCF to SSF
    receivingSideID [1] LegType
    -- used in operations sent from SSF to SCF
}

LegType ::= OCTET STRING (SIZE(1))

ServiceKey ::= Integer4
```

Value references have a similar syntax as type references except that
value references must start with a lower-case letter, and also carry
the values type.

Syntax
```
valueRef Type ::= value
```

For example
```
leg1 LegType ::= '01'H
leg2 LegType ::= '02'H

highLayerCompatibilityLength            INTEGER ::= 2
minAChBillingChargingLength             INTEGER ::= 0
```

## Types

Now when we have talked a bit about naming references, and how to
assign values and types I'll go over which built-in types exist, and
how to create new types.

There are some common types, each consists of a type reference and a
tag number.  The tag number is used to identify it when sending the
type in the network.  The universal tags are specified in [ITU-T
X.680](https://www.itu.int/rec/T-REC-X.680/en)

Here is a list of the most common types

| Type              | Universal Tag Number |
|-------------------|----------------------|
| BOOLEAN           | 1                    |
| INTEGER           | 2                    |
| BIT STRING        | 3                    |
| OCTET STRING      | 4                    |
| NULL              | 5                    |
| OBJECT IDENTIFIER | 6                    |
| EXTERNAL          | 8                    |
| REAL              | 9                    |
| ENUMERATED        | 10                   |
| UTF8String        | 12                   |
| TIME              | 14                   |
| SEQUENCE (OF)     | 16                   |
| SET (OF)          | 17                   |
| NumericString     | 18                   |
| IA5String         | 22                   |
| UTCTime           | 23                   |
| GeneralizedTime   | 24                   |
| VisibleString     | 26                   |
| DATE              | 31                   |
| TIME-OF-DAY       | 32                   |
| DATE-TIME         | 33                   |
| DURATION          | 34                   |
|                   |                      |
| CHOICE            | *                    |
| SELECTION         | *                    |


The common types can be divided into simple and structured types.
Structured types are the composition of multiple types (so called
component types) using one of the following types and keywords
`SEQUENCE`, `SEQUENCE OF`, `SET`, `SET OF`, `CHOICE`, and/or
`SELECTION`.  Note that `CHOICE` and `SELECTION` does not [need to]
have their own universal tags, due to those are consisting of other
types.

## Basic types

### BOOLEAN

The `BOOLEAN` type takes values `TRUE` or `FALSE`.

```
AudibleIndicator ::= CHOICE {
	tone								BOOLEAN,
	burstList							[1] BurstList
	}

```

Here the value `tone` of the composit type `AudibleIndicator` is of
type `BOOLEAN`. Note: It was one of the cleanest example I could find
of a `BOOLEAN` in the ASN.1 files we use, because Telco often use a
special "trick" when it comes to booleans in order to save bandwidth,
i.e. the `NULL` type.

### NULL

The `NULL` type is basically a placeholder, where the recognition of a
value is important but the actual value is not.

In 3GPP it is similar to `BOOLEAN` in the sense that a defined `NULL`
value is considered `TRUE` and if the value is missing it is
considered `FALSE`. The reason for this is that it will take no space
when sent over the network if it is `FALSE` and the same amount of
space as `BOOLEAN` if `TRUE`.

```
CancelArg {PARAMETERS-BOUND : bound} ::= CHOICE {
    invokeID            [0] InvokeID,
    allRequests         [1] NULL,
    callSegmentToCancel [2] CallSegmentToCancel {bound}
}
```

in this example `allRequests` can be defined (then only the tag is
transmitted) or not at all.

### INTEGER

`INTEGER` takes any of the infinite set of integer values. It can also
have the additional notation that names some of the values.


```
GSMMAPOperationLocalvalue ::= INTEGER{
    updateLocation (2),
    cancelLocation (3),
    provideRoamingNumber (4),
    noteSubscriberDataModified (5),
    resumeCallHandling (6),
    insertSubscriberData (7),
    -- rest of the named integers --
}
```

```
localvalue1 GSMMAPOperationLocalvalue ::= updateLocation
localvalue2 GSMMAPOperationLocalvalue ::= 2
localvalue3 GSMMAPOperationLocalvalue ::= -55413459
```
are all valid `GSMMAPOperationLocalvalue`s.

### ENUMERATED

`ENUMERATED` has the same interpretation as `INTEGER` but will hold
specific values only.


```
RequestedInformationType ::= ENUMERATED {
    callAttemptElapsedTime(0),
    callStopTime(1),
    callConnectedElapsedTime(2),
    calledAddress(3),
    releaseCause(30)
}
```

```
reqInfoType1 RequestedInformationType ::= callAttemptElapsedTime
reqInfoType2 RequestedInformationType ::= 0
```

are both valid values of `RequestInformationType`, while this is not:

```
notValidReqInfoType RequestedInformationType ::= 4
```

### BIT STRING

`BIT STRING` takes values that are a sequence of zero or more bits. It
can also take an additional notation that name certain bits in the bit
sequence.

```
DeferredLocationEventType ::= BIT STRING {
    msAvailable (0) ,
    enteringIntoArea (1),
    leavingFromArea (2),
    beingInsideArea (3) ,
    periodicLDR (4)
} (SIZE (1..16))
```

```
eventType1 DeferredLocationEventType ::= (msAvailable, beingInsideArea)
eventType2 DeferredLocationEventType ::= '10010'B
eventType3 DeferredLocationEventType ::= '12'H
```

are all valid value definitions of the same bit sequence where the
first and third bits are set, and no other bits are set.  The `B` stands
for binary representation and `H` for hexadecimal representation.

The `SIZE` is a constraint on the type defining it to be of a specific
length. This keyword comes as an extra notation for many of the
`STRING` types below (as well as some of the other types).

### OCTET STRING

Type `OCTET STRING` takes values that are an ordered sequence of zero
or more (eight-bit) octets.

```
MM-Code ::= OCTET STRING (SIZE (1))
```

In the same manor as `BIT STRING` both values below are valid
instances of `MM-Code`:

```
iMSI-Attach1 MM-Code ::= '00000010'B
iMSI-Attach2 MM-Code ::= '02'H
```

while

```
notValidIMSI-Attach MM-Code ::= '10010'B
```

is not considered a valid value due to it not being a multiple of eight bits.

### OBJECT IDENTIFIER

The `OBJECT IDENTIFIER` type (shortened `OID`) names information
objects such as ASN.1 modules. The named information object is a node
on an object identifier tree that is managed at the international
level.

ETSI for instance is managed by ITU-T
`itu-t(0) identified-organization(4) etsi(0)`

<div>
    <img src="/img/blog/the-specs-behind-the-specs/etsi_asn1oidtree.gif" alt="ETSI OID tree" />
</div>

and as can see in the `Modules` example version 8 of cap-datatypes is part of ETSI.
`CAP-datatypes {itu-t(0) identified-organization(4) etsi(0) mobileDomain(0) umts-network(1) modules(3) cap-datatypes(52) version8(7)}`

Other root arcs

| Root | Organization    |
| ---  | ---             |
| 0    | ITU-T           |
| 1    | ISO             |
| 2    | joint-iso-itu-t |

The labels are optional and the reference could also be written as `{0
4 0 0 1 3 52 7}`. Only positive integers are allowed including zero (0).

Another example comes from the CAP-object-identifiers module in ETSI 129.078.
```
tc-Messages OBJECT IDENTIFIER ::=
    {itu-t recommendation q 773 modules(2) messages(1) version3(3)}

id-CAP OBJECT IDENTIFIER ::=
    {itu-t(0) identified-organization(4) etsi(0) mobileDomain(0)
     umts-network(1) cap4(22)}

id-ac OBJECT IDENTIFIER ::= {id-CAP ac(3)}
```

`id-ac` is a child of the `id-CAP` object identifier.

One could lookup object identifiers by visiting this amazing
[page (oidref.com)](https://oidref.com/).


### EXTERNAL

`EXTERNAL` represents a value that does not need to be specified as a
ASN.1 type. It carries information on how the data should be interpreted.

```
Unidirectional {OPERATION:Invokable, OPERATION:Returnable} ::= SEQUENCE {
  dialoguePortion  DialoguePortion OPTIONAL,
  components       ComponentPortion{{Invokable}, {Returnable}}
}

DialoguePortion ::= [APPLICATION 11] EXPLICIT EXTERNAL
```

Here the value `dialoguePortion` will have tag 11 if specified, it is
then up to the application to decide how to deal with the value.

### REAL

Values of the type `REAL` will take a triplet of numbers (m, b, e),
where m is the mantissa (a signed number), b the base (2 or 10), and e
the exponent (a signed number).

There are also three special values it can take `PLUS-INFINITY`, 0,
and `MINUS-INFINITY`.

```
theBestRealValue REAL ::= (123, 10, -2) -- 1.23
maxValue REAL ::= PLUS-INFINITY
```

### Strings types

I feel like most of the string types are the same, except that they
all take diffrent character sets. I've already described `BIT STRING`
and `OCTET STRING` which both operate the bit set, but there is a
lot of others that operate over character sets.



| Type                         | Tag | Character set regex/comment                                                                                        |
|------------------------------|-----|--------------------------------------------------------------------------------------------------------------------|
| UTF8String                   | 12  | Synonymous with UniversalString at abstract level                                                                  |
| NumericString                | 18  | `[0-9 ]`                                                                                                           |
| PrintableString              | 19  | `[A-Za-z0-9'()+,./:=? -]`                                                                                          |
| TelexString (T61String)      | 20  | [ISOReg](ISOReg) reg. #6, #87,#102,#103,#106,#107, #126, #144, #150, #153, #156, #164, #165, #168 + space,delete            |
| VideotexString               | 21  | [ISOReg](ISOReg) reg. #1,#13,#72,#73,#87,#89,#102,#108,#126,#128,#129,#144,#150,#153,#164,#165,#168 + space,delete |
| IA5String                    | 22  | [ISOReg](ISOReg) reg. #1,#6 + space,delete                                                                         |
| GraphicString                | 25  | [ISOReg](ISOReg) graphical sets (called 'G') + space                                                               |
| VisibleString (ISO646String) | 26  | [ISOReg](ISOReg) reg. #6 + space                                                                                   |
| GeneralString                | 27  | [ISOReg](ISOReg) graphical sets (called 'G'), control characters (called 'C') + space,delete                       |
| UniversalString              | 28  | [ISO10646-1]                                                                                                       |
| BMPString                    | 30  | Basic Multilingual Plane; subtype of UniversalString                                                               |
|                              |     |                                                                                                                    |

[ISOReg](https://www.itscj-ipsj.jp/custom_contents/cms/linkfile/ISO-IR.pdf)


I'll just list some examples found in our ASN.1 files:

```
AMFNameUTF8String ::= UTF8String (SIZE(1..150, ...))

DirectoryString ::= CHOICE {
    teletexString TeletexString (SIZE (1..maxSize)),
    printableString PrintableString (SIZE (1..maxSize)),
    universalString UniversalString (SIZE (1..maxSize)),
    bmpString BMPString (SIZE (1..maxSize))
--    utf8String UTF8String (SIZE (1..maxSize))
    }

DisplayInformation ::= IA5String (SIZE (minDisplayInformationLength..maxDisplayInformationLength))
```


`IA5String` used to represent ISO 646 (IA5; International Alphabet 5) characters.
The entire character set contains precisely 128 characters and are
generally equivalent to the first 128 characters of the ASCII
alphabet.


### TIME
### UTCTime
### GeneralizedTime
### DATE
### TIME-OF-DAY
### DATE-TIME
### DURATION


## Structured types

### CHOICE

The type `CHOICE` can take values from one of multiple types.

```

```


### SEQUENCE (OF)

`SEQUENCE` and `SEQUENCE OF` are used for composing multiple types.


```
EventTypeSMS ::= ENUMERATED {
	sms-CollectedInfo					(1),
	o-smsFailure						(2),
	o-smsSubmission						(3),
	sms-DeliveryRequested				(11),
	t-smsFailure						(12),
	t-smsDelivery						(13)
}
MonitorMode ::= ENUMERATED {
	interrupted							(0),
	notifyAndContinue					(1),
	transparent							(2)
}

SMSEvent ::= SEQUENCE {
    eventTypeSMS   [0] EventTypeSMS,
    monitorMode    [1] MonitorMode
}

Tone ::= SEQUENCE {
    toneID         [0] Integer4,
    duration       [1] Integer4 OPTIONAL,
    ...
}
```

A value of the `SMSEvent` type have information on both `EventTypeSMS`
and `MonitorMode`. The fixed number of fields in the `SEQUENCE` type
are ordered.  Context-specific tagging (e.g. the `[0], [1], [2]` stuff
in the examples), is frequently applied for the structured types, but
one could also utilize the keywords `AUTOMATIC TAGGING` in the module
definition.



`SEQUENCE OF` on the other hand, holds an arbitrary number of fields
of a single type.

```
FilterItem ::= CHOICE {
    equality [0] AttributeValueAssertion,
    substrings [1] SEQUENCE {
    type ATTRIBUTE.&id({SupportedAttributes}),
    strings SEQUENCE OF CHOICE {
        initial [0] ATTRIBUTE.&Type
        ({SupportedAttributes}{@substrings.type}),
        any [1] ATTRIBUTE.&Type
        ({SupportedAttributes}{@substrings.type}),
        final [2] ATTRIBUTE.&Type
        ({SupportedAttributes}{@substrings.type}) }},
    greaterOrEqual [2] AttributeValueAssertion,
    lessOrEqual [3] AttributeValueAssertion,
    present [4] AttributeType,
    approximateMatch [5] AttributeValueAssertion,
    extensibleMatch [6] MatchingRuleAssertion
}
```

In the quite complex example above we see that the type `FilterItem`
is of type `CHOICE` and can take subtype called ``strings`. `strings`
is of type `SEQUENCE OF CHOICE` which means it can take a list of
zero, one or more of `initial`, `any` or `final`. The example is quite
complex because it also uses multiple parameterized values. see
[Automatic, Implicit, Explicit tags](#automatic-implicit-explicit-tags)

We find another example in the DialoguePDUs module from
[Q.773](https://www.itu.int/rec/T-REC-Q.773-199706-I/en) where the
AARQ is of type `SEQUENCE`, and the third field `user-infromation` is
an `SEQUENCE OF` `EXTERNAL` type.

```
AARQ-apdu ::= [APPLICATION 0] IMPLICIT SEQUENCE {
  protocol-version
    [0] IMPLICIT BIT STRING {version1(0)} DEFAULT {version1},
  application-context-name  [1]  OBJECT IDENTIFIER,
  user-information          [30] IMPLICIT SEQUENCE OF EXTERNAL OPTIONAL
}
```

They are quite different in how they are used, but they are encoded in
a similar way. Some languages represent `SEQUENCE` internally as a
`struct`, and `SEQUENCE OF` as an array, but encoded they would look
quite similar.

### SET (OF)

`SET` and `SET OF` are similar to `SEQUENCE` and `SEQUENCE OF`
respectively. The difference is that the composite types are
unordered.

From `CAP-datatypes` we find an example of a `SET OF` parameterized
type with size constraint.

```
GenericNumbers {PARAMETERS-BOUND : bound} ::= SET SIZE(1..bound.&numOfGenericNumbers) OF GenericNumber {bound}
```

Or an example of a value from the `TCAP-Tools` module in [Q.775](https://www.itu.int/rec/T-REC-Q.775-199706-I/en)

```

cancelFailed ERROR ::= {
  PARAMETER
    SET {problem   [0]  CancelProblem,
         invokeId  [1]  present < TCInvokeIdSet
    }
}
```


### SELECTION

The SELECTION type `<` is used when one want's to obtain one of the
possible subtypes of a `CHOICE` definition.

If we expand the previous example from the [SET](#set-of)

```
cancel OPERATION ::= {
  ARGUMENT  present < TCInvokeIdSet
  ERRORS    {cancelFailed}
}

cancelFailed ERROR ::= {
  PARAMETER
    SET {problem   [0]  CancelProblem,
         invokeId  [1]  present < TCInvokeIdSet
    }
}
```

we see that the `ARGUMENT` type and the invokeId field take the type
from the `present` field in the `TCInvokeIdSet` type.

the definition of `TCInvokeIdSet` is as follows

```
InvokeId ::= CHOICE {present  INTEGER,
                     absent   NULL
}

TCInvokeIdSet ::= InvokeId(WITH COMPONENTS {
                             present  (-128..127)
                           })
```

Thus `invokeId` and `ARGUMENT` fields will take integer values which
are between -128 and 127.

## DEFAULT and OPTIONAL keywords

One can use the `DEFAULT` keyword in order to specify the default value.

```
CollectedDigits ::= SEQUENCE {
  minimumNbOfDigits    [0] INTEGER (1..16) DEFAULT 1,
  maximumNbOfDigits    [1] INTEGER (1..16),
  endOfReplyDigit      [2] OCTET STRING (SIZE (1..2)) OPTIONAL,
  cancelDigit          [3] OCTET STRING (SIZE (1..2)) OPTIONAL,
  startDigit           [4] OCTET STRING (SIZE (1..2)) OPTIONAL,
  firstDigitTimeOut    [5] INTEGER (1..127) OPTIONAL,
  interDigitTimeOut    [6] INTEGER (1..127) OPTIONAL,
  errorTreatment       [7] ErrorTreatment DEFAULT stdErrorAndInfo,
  interruptableAnnInd  [8] BOOLEAN DEFAULT TRUE,
  voiceInformation     [9] BOOLEAN DEFAULT FALSE,
  voiceBack            [10] BOOLEAN DEFAULT FALSE
}
```

In this example we see the type `CollectedDigits` where most of the
values are either `DEFAULT` or `OPTIONAL`. The only value that needs
to be set is `maximumNbOfDigits`.

## Classes

## Special

### Parameterized components

```
    {}
```

### Extensions

```
    ...
```

### Automatic, Implicit, Explicit tags


## Deprecations of earlier ASN.1 specifications

### ANY

### Macros

## Encodings

### BER

Binary encoding rules

Oldest encoding rule

Tag-Length-Value format

### DER

Distinguished Encoding Rules

Subset of BER

### CER

Canonical Encoding Rules

Subset of BER used for X.509 digital certificates

### PER

Packed encoding rules

Most compact encoding rules, used for bandwidth conservation.

Does not send the Tag of the TLV because the order in which components
of the message occur is known.  PER also does not send the Length of
the TLV if the Value has a fixed length. Uses information from ASN.1
message description to eliminate redundant information from the Value
portion.

### OER

Octet encoding rules

Octet-oriented so all Tag-Length-Values are padded so that the length
are of multiples of 8 bits.

Fastest ASN.1 encoding

Favors encoding/decoding speed

### XER, E-XER

(Extended) XML encoding rules

### JER

JSON encoding rules


<!-- # Diameter dictionary files -->

<!-- <div> -->
<!--     <img src="/img/blog/sms/forward-sm.svg" alt="You calling your mom" /> -->
<!-- </div> -->
