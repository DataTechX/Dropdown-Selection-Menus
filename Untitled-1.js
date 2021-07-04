// คุณควรสร้างบอทนี้ที่ไหนสักแห่ง
const Discord = require("discord.js"); 
const client = new Discord.Client();
const dbs = require("discord-buttons");
dbs(client);
const { MessageMenuOption, MessageMenu } = require("discord-buttons")

//เข้าสู่ระบบบอท
client.login("DISCORD TOKEN")

client.on("ready", () => console.log("BOT IS ONLINE"));

//TUTORIAL
client.on("message", async message => {
    if(!message.guild || message.author.bot) return;

    const prefix = "+"

    if(message.content == prefix + "ping") {
        message.reply("PONG...")
    }    

    if (message.content == prefix + "menu") {
        let option1 = new MessageMenuOption()
        .setLabel("Test 1")
        .setValue("Test 1")
        .setDescription("นี่จะทำให้คุณมีตัวเลือก 1")
        .setDefault()
        .setEmoji("😆")
        
        let selection = new MessageMenu()
            .setID("Selection")
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder("คลิกฉันเพื่อทำการคัดเลือก! | POG")
            .addOption(option1)
        let embed = new Discord.MessageEmbed()
        .setColor("#36c3ff").setTitle("เลือก ไม่!")

        let menumsg = await message.channel.send(embed, selection)

        function menuselection(menu) {
            switch(menu.values[0]) {
                case "Test 1": 
                    menu.reply.send("ไม่รู้จะเขียนอะไรดี", true)
                break;
            }
        }

        client.on("clickMenu", (menu) => {
            if(menu.message.id == menumsg.id) {
                if(menu.clicker.user.id == message.author.id) menuselection(menu)
                else menu.reply.send(":x: คุณไม่ได้รับอนุญาตให้เลือกบางสิ่งบางอย่าง", true)
            }
        })
    }
})


//เอวร์ชั่น - ขยายได้โดยอัตโนมัติ
client.on("message", async message => {
    //ถ้าไม่ได้อยู่ในกิลด์และไม่ใช่ !mneu
    if(!message.guild || !message.content.startsWith("+menu") || message.author.bot) return;
    
    //COMMAND HANDLER FRIENDLY เป็นเพียงตัวอย่างพื้นฐานจริงๆ
    let cmduser = message.author;
    let menuoptions = [ 
      {
        value: "man1", description: "คุณคือผู้ชาย 1",
        replymsg: "คุณเป็นผู้ชายที่หล่อมากๆ", emoji: "❌" //optional
      },
    ]
    //กำหนดส่วนที่เลือก
    let Selection = new MessageMenu()
      .setID('MenuSelection') 
      .setMaxValues(1) //OPTIONAL นี่คือจำนวนค่าที่คุณสามารถมีได้ในแต่ละการเลือก
      .setMinValues(1) //OPTIONAL นี่คือจำนวนค่าที่คุณต้องมีในแต่ละการเลือก
      .setPlaceholder('คลิกฉันเพื่อทำการคัดเลือก!');  //ข้อความในตัวยึดตำแหน่งเนื้อหา
    menuoptions.forEach(option => {
      let row = new MessageMenuOption()
        .setLabel(option.label ? option.label : option.value)
        .setValue(option.value) 
        .setDescription(option.description) 
        .setDefault() 
      if(option.emoji) row.setEmoji(option.emoji) 
      Selection.addOption(row)
    })
    //กำหนดการฝัง
    let MenuEmbed = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setAuthor("Bot Help", client.user.displayAvatarURL())
      .setDescription("***เลือกสิ่งที่คุณต้องการใน 'การเลือก' ด้านล่าง!***")
    // ส่งเมนู msg
    let menumsg = await message.channel.send(MenuEmbed, Selection)
    //ฟังก์ชั่นจัดการการเลือกเมนู
    function menuselection(menu) {
      let menuoptiondata = menuoptions.find(v=>v.value == menu.values[0])
      menu.reply.send(menuoptiondata.replymsg, true);
    }
    //เอีเว้นท์
    client.on('clickMenu', (menu) => {
      if (menu.message.id === menumsg.id) {
        if (menu.clicker.user.id === cmduser.id) menuselection(menu);
        else menu.reply.send(`:x: คุณไม่ได้รับอนุญาตให้ทำเช่นนั้น! เท่านั้น: <@${cmduser.id}>`, true);
      }
    });
  })