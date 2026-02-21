import { ServiceCardProps } from "./types";

export const service: ServiceCardProps[] = [
  {
    id: "001",
    service: "Flower Arrangement",
    imageSrc1: "/asset/fa1.JPG",
    imageSrc2: "/asset/fa2.JPG",
    imageSrc3: "/asset/fa3.JPG",
    content: "",
    link: "",
    icon: "",
    description: [
      {
        id: "001",
        serviceId: "001",
        typeChoice: "text",
        content:
          "代官山・祐天寺で愛され続けて20年以上。2001年の開校以来、大切にしているのは「花と向き合う時間の豊かさ」です。花を通じた自己表現と癒やしのひとときをお届けします。",
        href: "",
        icon: "",
      },
    ],
  },
  {
    id: "002",
    service: "Accessories",
    imageSrc1: "/asset/ac1.PNG",
    imageSrc2: "/asset/ac2.png",
    imageSrc3: "/asset/ac3.JPG",
    content: "",
    link: "",
    icon: "",
    description: [
      {
        id: "001",
        serviceId: "002",
        typeChoice: "text",
        content:
          "どんなお洋服にもなじむ、きらめくお守り。日常に自然に溶け込み、ふとした瞬間に自信をくれる。毎日を少しだけ華やかにしてくれるイヤリングを中心としたラインナップです。",
        href: "",
        icon: "",
      },
    ],
  },
  {
    id: "003",
    service: "Beauty",
    imageSrc1: "",
    imageSrc2: "",
    imageSrc3: "",
    content: "Instagramにて近日公開予定",
    link: "https://www.instagram.com/hakkoubeauty365/",
    icon: "/asset/instagram.png",
    description: [
      {
        id: "001",
        serviceId: "003",
        typeChoice: "text",
        content: "美しさは健やかな体から。",
        href: "",
        icon: "",
      },
      {
        id: "002",
        serviceId: "003",
        typeChoice: "link",
        content: "発酵食大学での学びに基づき",
        href: "https://hakkoushoku.jp/",
        icon: "",
      },
      {
        id: "003",
        serviceId: "003",
        typeChoice: "text",
        content: "、美容に良い発酵食品を追求。今後は",
        href: "",
        icon: "",
      },
      {
        id: "004",
        serviceId: "003",
        typeChoice: "link",
        content: "Instagramを通じて",
        href: "https://www.instagram.com/hakkoubeauty365/",
        icon: "/asset/instagram.png",
      },
      {
        id: "005",
        serviceId: "003",
        typeChoice: "text",
        content: "、皆様の毎日を健やかにする情報を発信してまいります。",
        href: "",
        icon: "",
      },
    ],
  },
];
