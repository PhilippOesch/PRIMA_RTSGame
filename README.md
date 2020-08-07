# PRIMA
## Links
* [Link zum Spiel](https://philippoesch.github.io/PRIMA_RTSGame/game/mainMenu.html)
* [Quellcode](https://github.com/PhilippOesch/PRIMA_RTSGame/tree/master/game)

## Checkliste für Leistungsnachweis
Nr | Bezeichnung | Inhalt
---| ----------- | ------
  &#xfeff; | Titel | Super Mega Awesome RTS-Game
  &#xfeff; | Name | Philipp Oeschger
  &#xfeff; | Matrikelnummer | 257184
  1 | Nutzerinteraktion | Der Nutzer kann über den Startbutton im Hauptmenu das Spiel starten. Zunächst kann er vor dem Start einen Schwierigkeitsgrad anklicken. Der Nutzer kann auf die Spieler Basis klicken (Linksklick) und kann im danach offenen Kontextmenu eine (fals genug Geld vorhanden) eine Einheit kaufen. Einheiten kaufen geht ebenfalls mit den Tasten Q, W, E. Nach kaufen von Einheiten kann der Nutzer eine einzelne Einheit auswählen, indem er auf eine Einheit draufklickt (Linksklick), oder er kann mehrere Einheiten auswählen, indem er die linke Maustaste gedrückt hält, ein Rechteck um die gewünschten Einheiten zieht und dann wieder die linke Maustaste loslässt. Dann werden alle eigenen Einheiten innerhalb des Rechtecks ausgewählt. Alle Einheiten auf einmal können mit der Taste A ausgewählt werden. Nach der auswahl der Einheiten kann der Spieler mit der Rechtenmaustaste einen Wegpunkt bestimmen oder auf eine Gegnereinheit bzw. die Gegnerbasis klicken und diese angreifen.
  2 | Objektinteraktion | Ein Bullet (Projektil)-Objekt bekommt ein Spielobjekt zugeteilt. Sobalt das Bullet-Objekt mit dem Spielobjekt kollidiert, verrichtet es Schaden an diesem Objekt und das Bullet-Objekt wird gelöscht. Jedes Einheits-Objekt hat einen Warnehmnungsradius und einen Ausweichradius. Sobalt ein Objekt innerhalb des Ausweichsradius sich befindet, bekommt die Einheit den Gegenvektor des Objekts und versucht mithilfe diesem auszuweichen. Flugobjekte können nur mit anderen Flugobjekten kollidieren.
  3 | Objektanzahl | Der Spieler hat die Möglichkeit, verschiedene Einheiten zu generieren, falls genug Geld vorhanden ist. Die Gegner-KI kann ebenfalls Einheiten generieren. Einheiten können auch wieder vom Gegner zerstört werden.
  4 | Szenenhierarchie | Der auf der Hierarchieebene oben stehende Node ist der "graph"-Node. Auf der 2 Obersten Ebene befinden sich das Terrain, ein bullets-Node, welches alle Projektile speichert und ein gameobject-Node, welches alle Gameobject-Elemente enthält, darunter zählen die Gegner- und die Spieler-Basis und alle Einheits-Objekte.<br><br> Einheiten bestehen meist aus einem Eltern Knoten und einer Kanone (Kind-Knoten), der sich abhänig vom Eltern-Knoten in die Richtung des angezielten Objekts dreht.
  5 | Sound | Sound werden in folgenden Situationen abgespielt: <br>- Beim Abfeuern eines Projektils <br> - Beim Kollidieren des Projektils <br> - Bei einem erfolgreichen Kauf <br> - bei einem nicht erfolgreichen Kauf
  6 | GUI | Der Nutzer startet über ein Menü das Spiel. Der Nutzer kann im End-Screen wieder zurück zum Menü. Der Spieler kann im Startmenü, nach drücken des Play-Buttons, einen Schwierigkeitsgrad auswählen und nach der Auswahl startet das Spiel. Im Spiel sieht der Spieler Lebensanzeigen der Objekte. Auserdem hat der Nutzern einsicht auch Spieldauer, Geld, Einheiten und Zerstörte Einheiten. Der Nutzer kann wärend dem Spiel ein Kontextmenü öffnen, über welches er Einheiten kaufen kann. 
  7 | Externe Daten | In einer settings.json ist es möglich, Einstellungen zu verändern. Es kann die Spielfeldgröße, die Kameradistanz, die Maximale Spieleranzahl pro Seite und die Stärke der einzelnen Einheitstypen angepasst werden. Es kann der Rüstungswert der Basen angepasst werden und somit indirekt die relative Spieldauer verlängert werden.
  8 | Verhaltensklassen | Es wurden folgende Verhaltensklassen definiert: <br> Bullet - Flugverhalten und Kollision mit Zielobjekt <br> GameObject Schadensverhalten und Selectionsverhalten von Spielobjekten <br> Unit - Bewegen zu Wegpunkten, attackieren von Gegnereinheiten <br> Flock - Ausweichverhalten von Einheitsobjekten <br> AIManager - Verwaltet das Verhalten der KI <br> Audio - verwaltet Sounds und spielt diese ab <br> Base - realisiern der Basis-Objekte von Gegner bzw. Spieler <br> Bomber - realisiert Bomber-Einheit <br> BuyKontextMenu - verwaltet Kaufinteraktionen des Spielers <br> Healthbar - realisiern der Lebensanzeigen <br> PlayerManager - verwaltet Spielerinteraktionen und Spielerobjekte <br> PlainFlock - Ausweichverhalten bezogen auf Flugobjekte <br> SuperTank - Realsierung der Einheit "SuperTank" <br> TankUnit - Realisierung der Panzer-Einheit
  9 | Subklassen | Die Einheitstyp-Klassen: TankUnit, Bomber, SuperTank erben alle von der Klasse Unit. Unit enthält die Logik für das Bewegen und Projectilabfeuern der Einheiten. Unit ist eine Abstrakte-Klasse. Die Klasse Unit erbt von der Klasse GameObject welche ebenfalls eine abstrakte Klasse ist. GameObject enthält alle Fuktionalitäten für die Maus-Selectierbarkeit und das Schadennehmen von Objekten. Eine Realisierung für die GameObject-Klasse, ist die Base-Klasse welche eine Spielerbasis/ Gegnerbasis beschreibt. GameObject, Bullet, PlayerManager als auch AIManager erben von der Fudge-Klasse Node.
10 | Maße & Positionen | Der Mittelpunkt des Koordinatensystem befindet sich mittig der Kamera im Zentrum des Spielfelds. Das Spielfeld breitet sich auf der x-y-Ebene aus. Standardmäßig ist das Spielfeld 30 (breite)* 20 (höhe) groß. Alles orientiert sich an der gewöhlichen Panzer-Einheit (TankUnit), diese ist eine Einheit im Durchmesser. Eine Basis ist 2 Einheiten breit also das doppelte der Panzereinheit. Eine "SuperTank"-Einheit ist 1.5 mal so groß wie eine normale Panzereinheit. Eine Bomber-Einheit ist 2 Einheiten groß. Bei der Gruppierung halten Einheiten ca einen Abstand von 2 Einheiten von Mittelpunkt zu Mittelpunkt.
11 | Event-System | Tasteninteraktionen und Mausinteraktione werden mit Listenern gehandhabt. Alle sich über die Zeit verändernden Objekte so wie Einheits- und Projectilobjekte besitzen eine update-Funktion die als Handler für Fudge-LoopFrameListener dienen. Wenn Spieler- oder Gegner-Basis zerstört werden so wird von der Zerstörten Basis ein CustumEvent an das PlayerManager-Objekt gesendet. PlayerManager besitzt EventListener für den Fall "Spiel Gewonnen", "Spiel verloren" die Hander der beiden Events laden den EndScreen mit dem passenden Text. <br> Wenn die Gegnerbasis weniger als die Hälfte des Ursprungslebens besitzt, so sendet sie ein Event an den AIManager. Der AIManager setzt im Handler den Zustand auf defensiv.
