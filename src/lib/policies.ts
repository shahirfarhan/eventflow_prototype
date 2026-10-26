/**
 * Gaffers Platform Policies, shown in the Terms pop-up on the sign-up form.
 * Edit the text here to update what users see.
 *
 * Before going live: fill in every "[insert …]" placeholder below.
 */

export const POLICIES_EFFECTIVE_DATE = "25 September 2026"
export const POLICIES_COMPANY = "Gaffers Application"

export type PolicyBlock =
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }

export type PolicySection = { number: string; title: string; blocks: PolicyBlock[] }

export type PolicyPart = {
  id: string
  part: string
  title: string
  intro?: PolicyBlock[]
  sections: PolicySection[]
}

export const POLICY_PARTS: PolicyPart[] = [
  {
    "id": "part-1",
    "part": "Part 1",
    "title": "Terms of Service",
    "sections": [
      {
        "number": "1.1",
        "title": "Acceptance of Terms",
        "blocks": [
          {
            "type": "p",
            "text": "These Terms of Service (\"Terms\") govern access to and use of the Gaffers website and mobile application (the \"Platform\"), operated by Gaffers Application (\"Gaffers\", \"we\", \"us\"). By creating an account, browsing vendor listings, or making a booking, you (\"User\") agree to be bound by these Terms, the Privacy Policy, the Payment Policy, the Cancellation & Refund Policy and, where applicable, the Vendor Policy, all of which are incorporated by reference."
          }
        ]
      },
      {
        "number": "1.2",
        "title": "Definitions",
        "blocks": [
          {
            "type": "ul",
            "items": [
              "\"Planner\" means a User who books event services through the Platform.",
              "\"Vendor\" means a business or individual offering event-related services or products for booking through the Platform (e.g. caterers, decorators, photographers, entertainers, venues, equipment rental).",
              "\"Booking\" means a confirmed engagement between a Planner and a Vendor arranged through the Platform.",
              "\"Listing\" means a Vendor's published service offering, including pricing, availability, and portfolio content.",
              "\"Platform Fee\" means the commission or service fee charged by Gaffers on a Booking, as set out in the Payment Policy."
            ]
          }
        ]
      },
      {
        "number": "1.3",
        "title": "Nature of the Platform",
        "blocks": [
          {
            "type": "p",
            "text": "Gaffers is a marketplace that connects Planners with independent, third-party Vendors. Gaffers is not a party to the underlying service contract formed between a Planner and a Vendor, does not itself provide event services, and does not control the quality, timing, legality, or execution of any service a Vendor delivers. Gaffers' role is limited to facilitating discovery, booking, payment processing, and review collection."
          }
        ]
      },
      {
        "number": "1.4",
        "title": "Eligibility & Account Registration",
        "blocks": [
          {
            "type": "ol",
            "items": [
              "Users must be at least 18 years old and capable of forming a binding contract under the Contracts Act 1950.",
              "Vendors must provide a valid business registration (SSM) number or, for sole proprietors, a valid identification document, as set out in the Vendor Policy.",
              "Users are responsible for maintaining the confidentiality of their login credentials and for all activity under their account."
            ]
          }
        ]
      },
      {
        "number": "1.5",
        "title": "User Conduct",
        "blocks": [
          {
            "type": "p",
            "text": "Users must not: (a) circumvent the Platform to transact directly with a matched party in order to avoid Platform Fees; (b) post false, misleading, or defamatory content, including fabricated reviews; (c) use the Platform for any unlawful purpose; (d) harass, threaten, or discriminate against another User; or (e) upload content that infringes a third party's intellectual property rights."
          }
        ]
      },
      {
        "number": "1.6",
        "title": "Fees",
        "blocks": [
          {
            "type": "p",
            "text": "Use of the Platform to browse Listings is free for Planners. Gaffers charges a Platform Fee on completed Bookings as set out in the Payment Policy. Fees are disclosed prior to Booking confirmation and are non-negotiable outside of published promotions."
          }
        ]
      },
      {
        "number": "1.7",
        "title": "Intellectual Property",
        "blocks": [
          {
            "type": "p",
            "text": "The Platform, including its design, logo, and software, is owned by Gaffers. Vendors retain ownership of content they upload (photos, descriptions, portfolios) but grant Gaffers a worldwide, royalty-free licence to display, reproduce, and promote that content on the Platform and in Gaffers' marketing."
          }
        ]
      },
      {
        "number": "1.8",
        "title": "Limitation of Liability",
        "blocks": [
          {
            "type": "p",
            "text": "To the maximum extent permitted by law, Gaffers is not liable for any loss, damage, injury, or dispute arising from the performance (or non-performance) of a Vendor's services, including cancellations, property damage, or personal injury occurring at an event. Gaffers' aggregate liability to a User for any claim arising from use of the Platform is limited to the Platform Fee paid by that User in connection with the relevant Booking."
          }
        ]
      },
      {
        "number": "1.9",
        "title": "Termination",
        "blocks": [
          {
            "type": "p",
            "text": "Gaffers may suspend or terminate a User's account for breach of these Terms, fraudulent activity, or repeated policy violations, with notice where practicable. Users may close their account at any time; open Bookings must be resolved (completed, cancelled, or refunded per policy) before closure."
          }
        ]
      },
      {
        "number": "1.10",
        "title": "Governing Law & Dispute Resolution",
        "blocks": [
          {
            "type": "p",
            "text": "These Terms are governed by the laws of Malaysia. Disputes between Gaffers and a User that cannot be resolved informally will be referred first to mediation, and failing that, to the exclusive jurisdiction of the courts of Malaysia. Disputes between a Planner and a Vendor are addressed separately under Part 1.11 below and are the responsibility of those two parties, with Gaffers acting only as facilitator."
          }
        ]
      },
      {
        "number": "1.11",
        "title": "Amendments",
        "blocks": [
          {
            "type": "p",
            "text": "Gaffers may update these Terms from time to time. Material changes will be notified via the Platform or email at least 14 days before taking effect. Continued use of the Platform after that date constitutes acceptance."
          }
        ]
      }
    ]
  },
  {
    "id": "part-2",
    "part": "Part 2",
    "title": "User Agreement (Event Planners)",
    "sections": [
      {
        "number": "2.1",
        "title": "Scope",
        "blocks": [
          {
            "type": "p",
            "text": "This User Agreement applies specifically to Planners and supplements the Terms of Service. Where there is a conflict, this Agreement governs for matters relating to the booking relationship between a Planner and a Vendor."
          }
        ]
      },
      {
        "number": "2.2",
        "title": "Booking Process",
        "blocks": [
          {
            "type": "ol",
            "items": [
              "A Planner submits a booking request against a Vendor's published Listing, specifying event date, location, and scope.",
              "Depending on the Vendor's settings, a Booking is confirmed either (a) instantly upon payment, or (b) upon the Vendor's acceptance within [insert response window, e.g. 24 hours].",
              "A Booking is binding on both parties once confirmed and payment (or deposit) has been processed.",
              "Any changes to event scope, date, or guest count after confirmation must be agreed directly with the Vendor and may incur additional charges."
            ]
          }
        ]
      },
      {
        "number": "2.3",
        "title": "Planner Obligations",
        "blocks": [
          {
            "type": "ul",
            "items": [
              "Provide accurate event details (date, venue, headcount, access requirements) at the time of booking.",
              "Make payment in accordance with the Payment Policy.",
              "Provide reasonable access and facilities at the event venue for the Vendor to perform the booked service.",
              "Communicate cancellations or changes as early as possible."
            ]
          }
        ]
      },
      {
        "number": "2.4",
        "title": "Payment Obligations",
        "blocks": [
          {
            "type": "p",
            "text": "Full payment, or a deposit as specified in the Listing, must be made through the Platform at the time of Booking confirmation. Off-platform payment to a Vendor to avoid the Platform Fee is a breach of these Terms and voids Gaffers' dispute-resolution and payment-protection coverage for that Booking."
          }
        ]
      },
      {
        "number": "2.5",
        "title": "Cancellations",
        "blocks": [
          {
            "type": "p",
            "text": "Cancellations by a Planner are governed by Part 5 (Cancellation & Refund Policy)."
          }
        ]
      },
      {
        "number": "2.6",
        "title": "Reviews & Ratings",
        "blocks": [
          {
            "type": "p",
            "text": "Planners may leave a review and star rating only after a Booking is marked complete. Reviews must reflect genuine experience with the Vendor and must not contain defamatory, unlawful, or unrelated content. Vendors may publicly respond to a review once."
          }
        ]
      },
      {
        "number": "2.7",
        "title": "Prohibited Conduct",
        "blocks": [
          {
            "type": "ul",
            "items": [
              "Requesting services outside the scope of a Vendor's Listing without renegotiating price.",
              "Submitting fraudulent chargebacks for services genuinely rendered.",
              "Using a Vendor's contact details obtained through the Platform to solicit future off-platform bookings."
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "part-3",
    "part": "Part 3",
    "title": "Privacy Policy",
    "sections": [
      {
        "number": "3.1",
        "title": "Data We Collect",
        "blocks": [
          {
            "type": "ul",
            "items": [
              "Account data: name, email, phone number, password (hashed).",
              "Vendor business data: business name, business address, bank account details, licences/certifications.",
              "Booking data: event date, location, guest count, service scope, messages exchanged between Planner and Vendor.",
              "Payment data: processed by our licensed payment partner (see Part 4.7); Gaffers stores only transaction references, not full card numbers.",
              "Usage data: device information, IP address, app interaction logs, for security and analytics.",
              "Content: photos, portfolios, and reviews uploaded by Users."
            ]
          }
        ]
      },
      {
        "number": "3.2",
        "title": "How We Use Data",
        "blocks": [
          {
            "type": "ul",
            "items": [
              "To operate the marketplace: matching, booking, payment processing, and dispute resolution.",
              "To verify Vendor identity and business legitimacy.",
              "To send booking confirmations, reminders, and service updates.",
              "To improve the Platform through aggregated, anonymised analytics.",
              "To send marketing communications, where the User has opted in (opt-out available at any time)."
            ]
          }
        ]
      },
      {
        "number": "3.3",
        "title": "Data Sharing",
        "blocks": [
          {
            "type": "p",
            "text": "We share the minimum data necessary for a Booking to proceed: a Planner's event details and contact information are shared with the matched Vendor upon Booking confirmation, and vice versa. We share payment data with our licensed payment gateway partner, and may share data with cloud hosting providers, analytics providers, and regulators or law enforcement where legally required. We do not sell personal data to third parties."
          }
        ]
      },
      {
        "number": "3.4",
        "title": "Data Retention",
        "blocks": [
          {
            "type": "p",
            "text": "Account and Booking data is retained for the duration of the account's existence plus [insert period, e.g. 6 years] to meet accounting, tax, and dispute-resolution obligations under Malaysian law. Data is deleted or anonymised thereafter, save where retention is legally required."
          }
        ]
      },
      {
        "number": "3.5",
        "title": "Your Rights Under the PDPA",
        "blocks": [
          {
            "type": "p",
            "text": "Users may request access to, or correction of, their personal data, and may withdraw consent to marketing communications, by contacting our Data Protection point of contact below. We will respond within the timeframe prescribed by the PDPA."
          }
        ]
      },
      {
        "number": "3.6",
        "title": "Data Security",
        "blocks": [
          {
            "type": "p",
            "text": "We apply industry-standard technical and organisational measures (encryption in transit and at rest, access controls, regular security review) to protect personal data against unauthorised access, loss, or misuse."
          }
        ]
      },
      {
        "number": "3.7",
        "title": "Cookies & Tracking",
        "blocks": [
          {
            "type": "p",
            "text": "The Platform uses cookies and similar technologies for authentication, preference storage, and analytics. Users can manage cookie preferences through their browser or device settings; disabling some cookies may limit Platform functionality."
          }
        ]
      }
    ]
  },
  {
    "id": "part-4",
    "part": "Part 4",
    "title": "Payment Policy",
    "sections": [
      {
        "number": "4.1",
        "title": "Payment Flow",
        "blocks": [
          {
            "type": "ol",
            "items": [
              "A Planner pays the full Booking amount (or an agreed deposit) into the Platform at the time of Booking confirmation. Funds are held by our licensed payment partner pending event completion.",
              "Funds are released to the Vendor [insert timing, e.g. 24–48 hours after the event date], less the Platform Fee, provided no dispute has been raised.",
              "For Bookings paid via deposit, the balance is due 7 days before the event and is auto-charged to the Planner's saved payment method unless otherwise agreed."
            ]
          }
        ]
      },
      {
        "number": "4.2",
        "title": "Accepted Payment Methods",
        "blocks": [
          {
            "type": "ul",
            "items": [
              "Credit/debit card, FPX online banking, and e-wallet options as supported by our payment partner.",
              "All payments must be made through the Platform. Cash or off-platform bank transfers direct to a Vendor are not covered by Gaffers' payment protection or dispute resolution."
            ]
          }
        ]
      },
      {
        "number": "4.3",
        "title": "Platform Commission & Fees",
        "blocks": [
          {
            "type": "p",
            "text": "Gaffers charges a commission of [insert %, e.g. 10–15%] of the Booking value, deducted from the Vendor's payout. Planners may additionally be charged a payment processing fee of [insert %] shown at checkout. The applicable rate is disclosed before Booking confirmation."
          }
        ]
      },
      {
        "number": "4.4",
        "title": "Vendor Payout Schedule",
        "blocks": [
          {
            "type": "p",
            "text": "Vendor payouts are processed on a [insert cadence, e.g. weekly] cycle to the bank account verified during onboarding. A Vendor can track pending and completed payouts in their dashboard."
          }
        ]
      },
      {
        "number": "4.5",
        "title": "Currency & Taxes",
        "blocks": [
          {
            "type": "p",
            "text": "All transactions are processed in Malaysian Ringgit (MYR). Vendors are responsible for their own income tax obligations. Where applicable, Sales and Service Tax (SST) on the Platform Fee is disclosed separately and Gaffers will issue tax invoices for its own commission."
          }
        ]
      },
      {
        "number": "4.6",
        "title": "Disputed Payments",
        "blocks": [
          {
            "type": "p",
            "text": "If a Planner raises a dispute before funds are released (e.g. service not rendered), the payout to the Vendor is paused pending resolution under the Dispute Resolution process in Part 1.10 and the Cancellation & Refund Policy in Part 5. Chargebacks filed directly with a card issuer for a service that was genuinely delivered may result in account suspension."
          }
        ]
      },
      {
        "number": "4.7",
        "title": "Licensed Payment Partner",
        "blocks": [
          {
            "type": "p",
            "text": "Gaffers does not itself hold or custody User funds. All payment processing and fund holding is carried out by [insert licensed payment gateway/e-money partner, e.g. a Bank Negara Malaysia–approved provider], engaged to ensure compliance with the Financial Services Act 2013 and applicable payment systems regulation."
          }
        ]
      }
    ]
  },
  {
    "id": "part-5",
    "part": "Part 5",
    "title": "Cancellation & Refund Policy",
    "sections": [
      {
        "number": "5.1",
        "title": "Planner-Initiated Cancellations",
        "blocks": [
          {
            "type": "p",
            "text": "Refunds to a Planner who cancels a confirmed Booking are tiered by notice period, unless a Vendor's Listing specifies a stricter policy (which must be disclosed at booking):"
          },
          {
            "type": "table",
            "head": [
              "Notice Before Event",
              "Refund to Planner"
            ],
            "rows": [
              [
                "14+ days",
                "Full refund, less payment processing fee"
              ],
              [
                "7–13 days",
                "50% refund"
              ],
              [
                "48 hours – 6 days",
                "25% refund"
              ],
              [
                "Under 48 hours",
                "Non-refundable"
              ]
            ]
          }
        ]
      },
      {
        "number": "5.2",
        "title": "Vendor-Initiated Cancellations",
        "blocks": [
          {
            "type": "p",
            "text": "A Vendor who cancels a confirmed Booking must notify the Platform and the Planner immediately. Consequences scale with proximity to the event date and repeat frequency:"
          },
          {
            "type": "ul",
            "items": [
              "Planner receives a full refund regardless of notice period.",
              "Cancellations inside 7 days of the event incur a penalty fee to the Vendor and a rating impact flag on their profile.",
              "A Vendor with 3 cancellations within a rolling 90-day period is subject to temporary suspension pending review.",
              "Where feasible, Gaffers support will attempt to source a replacement Vendor for the Planner at no additional Platform Fee."
            ]
          }
        ]
      },
      {
        "number": "5.3",
        "title": "Force Majeure",
        "blocks": [
          {
            "type": "p",
            "text": "Where a Booking cannot proceed due to circumstances beyond either party's reasonable control (e.g. natural disaster, government-mandated event restrictions, venue closure), the Booking may be rescheduled or refunded in full at Gaffers' discretion, without penalty to either party."
          }
        ]
      },
      {
        "number": "5.4",
        "title": "No-Show Policy",
        "blocks": [
          {
            "type": "ul",
            "items": [
              "Planner no-show (Vendor arrives, service cannot be delivered): treated as a Planner cancellation inside 48 hours — non-refundable.",
              "Vendor no-show: full refund to Planner plus the penalties set out in Part 5.2, and priority escalation for review."
            ]
          }
        ]
      },
      {
        "number": "5.5",
        "title": "Refund Processing",
        "blocks": [
          {
            "type": "p",
            "text": "Approved refunds are processed to the Planner's original payment method within 2 weeks, subject to the processing timelines of the payment partner and card issuer."
          }
        ]
      }
    ]
  },
  {
    "id": "part-6",
    "part": "Part 6",
    "title": "Vendor Policy (Vendor Agreement)",
    "sections": [
      {
        "number": "6.1",
        "title": "Vendor Eligibility & Verification",
        "blocks": [
          {
            "type": "ol",
            "items": [
              "Vendors must provide a valid SSM business registration number (for registered companies/enterprises) or a valid national ID (for sole individual providers, subject to category restrictions).",
              "Vendors in regulated categories (e.g. food & beverage, pyrotechnics, structures/rigging, transport) must ensure they have the relevant licence or permit before their Listing is published.",
              "Gaffers verifies bank account details against the registered business/individual name before enabling payouts.",
              "Gaffers reserves the right to decline or remove a Vendor whose verification cannot be satisfactorily completed."
            ]
          }
        ]
      },
      {
        "number": "6.2",
        "title": "Listing Standards",
        "blocks": [
          {
            "type": "ul",
            "items": [
              "Listing content (photos, pricing, descriptions) must accurately represent the Vendor's own work — stock imagery or another business's portfolio is prohibited.",
              "Pricing shown must be all-inclusive of what a Planner can expect to pay before add-ons are disclosed separately.",
              "Availability calendars must be kept up to date; repeated overbooking resulting in cancellation is treated under Part 5.2."
            ]
          }
        ]
      },
      {
        "number": "6.3",
        "title": "Commission Structure",
        "blocks": [
          {
            "type": "p",
            "text": "Gaffers charges a commission of 8% on the first RM5,000 and 5% on anything above on the gross value of each completed Booking, deducted before payout as set out in Part 4.3. No listing fee is charged to join the Platform."
          }
        ]
      },
      {
        "number": "6.4",
        "title": "Service Level Obligations",
        "blocks": [
          {
            "type": "ul",
            "items": [
              "Respond to booking requests within 24 hours.",
              "Deliver the service as described in the Listing, at the agreed date, time, and venue.",
              "Maintain a minimum average rating of [insert threshold, e.g. 3.5/5] to remain actively listed; Vendors falling below this threshold enter a review/improvement process before suspension."
            ]
          }
        ]
      },
      {
        "number": "6.5",
        "title": "Cancellations & No-Shows",
        "blocks": [
          {
            "type": "p",
            "text": "Governed by Part 5.2 and 5.4 above. Vendors should read these in full before accepting Bookings, as repeated cancellations directly affect account standing."
          }
        ]
      },
      {
        "number": "6.6",
        "title": "Reviews",
        "blocks": [
          {
            "type": "p",
            "text": "Vendors may respond publicly to a Planner review once. Vendors may flag a review they believe is fraudulent, defamatory, or not tied to a genuine completed Booking for Gaffers' review team to assess."
          }
        ]
      },
      {
        "number": "6.7",
        "title": "Suspension & Termination",
        "blocks": [
          {
            "type": "p",
            "text": "Gaffers may suspend or terminate a Vendor account for: verification fraud, repeated cancellations, sustained sub-threshold ratings, circumvention of the Platform to transact off-platform, or breach of these policies. Vendors will be notified of the reason and, where applicable, given an opportunity to remedy before permanent removal."
          }
        ]
      },
      {
        "number": "6.8",
        "title": "Insurance & Liability",
        "blocks": [
          {
            "type": "p",
            "text": "Vendors are solely responsible for the safety and legality of the services they deliver, and for holding any insurance appropriate to their category (e.g. public liability insurance for on-site services). Gaffers may require proof of insurance as a condition of listing for higher-risk categories."
          }
        ]
      }
    ]
  }
]
