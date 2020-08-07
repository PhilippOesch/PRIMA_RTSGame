# PRIMA
## Links
* [Link zum Spiel](https://philippoesch.github.io/PRIMA_RTSGame/game/scenes/mainMenu.html)
* [Quellcode](https://github.com/PhilippOesch/PRIMA_RTSGame/tree/master/game)
* [Bedienungsanleitung](https://github.com/PhilippOesch/PRIMA_RTSGame/blob/master/README.md#bedienungsanleitung)
* [Designdokument](https://github.com/PhilippOesch/PRIMA_RTSGame/blob/master/documentation/Designdokument.pdf)
* [Gepacktes Archiv](https://github.com/PhilippOesch/PRIMA_RTSGame/blob/master/PRIMA_RTSGame.zip)

## Checkliste für Leistungsnachweis
Nr | Bezeichnung | Inhalt
---| ----------- | ------
  &#xfeff; | Titel | Super Mega Awesome RTS-Game
  &#xfeff; | Name | Philipp Oeschger
  &#xfeff; | Matrikelnummer | 257184
  1 | Nutzerinteraktion | Der Nutzer kann über den Startbutton im Hauptmenü das Spiel starten. Zunächst kann er vor dem Start einen Schwierigkeitsgrad anklicken. Der Nutzer kann auf die Spieler Basis klicken (Linksklick) und kann im danach offenen Kontextmenü (falls genug Geld vorhanden ist) eine Einheit kaufen. Einheiten kaufen geht ebenfalls mit den Tasten "Q", "W", "E". Nach kaufen von Einheiten kann der Nutzer eine einzelne Einheit auswählen, indem er auf eine Einheit darauf klickt (Linksklick), oder er kann mehrere Einheiten auswählen, indem er die linke Maustaste gedrückt hält, ein Rechteck um die gewünschten Einheiten zieht und dann wieder die linke Maustaste loslässt. Dann werden alle eigenen Einheiten innerhalb des Rechtecks ausgewählt. Alle Einheiten auf einmal können mit der Taste "A "ausgewählt werden. Nach der Auswahl der Einheiten kann der Spieler mit der rechten Maustaste einen Wegpunkt bestimmen oder auf eine Gegnereinheit bzw. die Gegnerbasis klicken und diese angreifen.
  2 | Objektinteraktion | Ein Bullet (Projektil)-Objekt bekommt ein Spielobjekt zugeteilt. Sobald das Bullet-Objekt mit dem Spielobjekt kollidiert, verrichtet es Schaden an diesem Objekt und das Bullet-Objekt wird gelöscht. Jedes Einheits-Objekt hat einen Wahrnehmungsradius und einen Ausweichradius. Sobald ein Objekt innerhalb des Ausweichsradius sich befindet, bekommt die Einheit den Gegenvektor des Objekts und versucht mithilfe diesem auszuweichen. Flugobjekte können nur mit anderen Flugobjekten kollidieren.
  3 | Objektanzahl | Der Spieler hat die Möglichkeit, verschiedene Einheiten zu generieren, falls genug Geld vorhanden ist. Die Gegner-KI kann ebenfalls Einheiten generieren. Einheiten können auch wieder vom Gegner zerstört werden.
  4 | Szenenhierarchie | Der auf der Hierarchie-Ebene oben stehende Node ist der "graph"-Node. Auf der 2 obersten Ebene befinden sich das Terrain, ein "bullets"-Node, welches alle Projektile speichert und ein "gameobject"-Node, welches alle Gameobject-Elemente enthält, darunter zählen die Gegner- und die Spieler-Basis und alle Einheits-Objekte.<br><br> Einheiten bestehen meist aus einem Elternknoten und einer Kanone (Kind-Knoten), der sich abhängig vom Eltern-Knoten in die Richtung des angezielten Objekts dreht.
  5 | Sound | Sounds werden in folgenden Situationen abgespielt: <br>- Beim Abfeuern eines Projektils <br> - Beim Kollidieren des Projektils <br> - Bei einem erfolgreichen Kauf <br> - bei einem nicht erfolgreichen Kauf.
  6 | GUI | Der Nutzer startet über ein Menü das Spiel. Der Nutzer kann im End-Screen wieder zurück zum Menü. Der Spieler kann im Startmenü, nach Drücken des Play-Buttons, einen Schwierigkeitsgrad auswählen und nach der Auswahl startet das Spiel. Im Spiel sieht der Spieler Lebensanzeigen der Objekte. Außerdem hat der Nutzern Einsicht auf Spieldauer, Geld, Einheiten und zerstörte Einheiten. Der Nutzer kann während dem Spiel ein Kontextmenü öffnen, über welches er Einheiten kaufen kann.
  7 | Externe Daten | In einer "settings.json" ist es möglich, Einstellungen zu verändern. Es kann die Spielfeldgröße, die Kameradistanz, die maximale Spieleranzahl pro Seite und die Stärke der einzelnen Einheitstypen angepasst werden. Es kann der Rüstungswert der Basen angepasst werden und somit indirekt die relative Spieldauer verlängert werden.
  8 | Verhaltensklassen | Es wurden folgende Verhaltensklassen definiert: <br> Bullet - Flugverhalten und Kollision mit Zielobjekt <br> GameObject Schadensverhalten und Selektionsverhalten von Spielobjekten <br> Unit - Bewegen zu Wegpunkten, attackieren von Gegnereinheiten <br> Flock - Ausweichverhalten von Einheitsobjekten <br> AIManager - verwaltet das Verhalten der KI <br> Audio - verwaltet Sounds und spielt diese ab <br> Base - realisiern der Basis-Objekte von Gegner bzw. Spieler <br> Bomber - realisiert Bomber-Einheit <br> BuyKontextMenu - verwaltet Kaufinteraktionen des Spielers <br> Healthbar - realisiern der Lebensanzeigen <br> PlayerManager - verwaltet Spielerinteraktionen und Spielerobjekte <br> PlainFlock - Ausweichverhalten bezogen auf Flugobjekte <br> SuperTank - Realsierung der Einheit "SuperTank" <br> TankUnit - Realisierung der Panzer-Einheit.
  9 | Subklassen | Die Einheitstyp-Klassen: TankUnit, Bomber, SuperTank erben alle von der Klasse Unit. Unit enthält die Logik für das Bewegen und Projectilabfeuern der Einheiten. Unit ist eine Abstrakte-Klasse. Die Klasse Unit erbt von der Klasse GameObject welche ebenfalls eine abstrakte Klasse ist. GameObject enthält alle Funktionalitäten für die Maus-Selektierbarkeit und das Schadennehmen von Objekten. Eine Realisierung für die GameObject-Klasse,  ist die Base-Klasse welche eine Spielerbasis/ Gegnerbasis beschreibt. GameObject, Bullet, PlayerManager, AIManager und die Audio-Klasse erben von der Fudge-Klasse Node.
10 | Maße & Positionen | Der Mittelpunkt des Koordinatensystems befindet sich mittig der Kamera im Zentrum des Spielfelds. Das Spielfeld breitet sich auf der x-y-Ebene aus. Standardmäßig ist das Spielfeld 30 (Breite)* 20 (Höhe) groß. Alles orientiert sich an der gewöhlichen Panzer-Einheit (TankUnit), diese ist eine Einheit im Durchmesser. Eine Basis ist 2 Einheiten breit also das doppelte der Panzereinheit. Eine "SuperTank"-Einheit ist 1.5 mal so groß wie eine normale Panzereinheit. Eine Bomber-Einheit ist 2 Einheiten groß. Bei der Gruppierung halten Einheiten ca. einen Abstand von 3 Einheiten von Mittelpunkt zu Mittelpunkt.
11 | Event-System | Für die Marktinteraktionen innerhalb des Viewports, werden die Fudge-Events "pointer-down", "pointer-move" und "pointer-down" verwendet. Für Tasten-Shortcuts gibt es einen Event-Listener für das Event "keydown". Wenn Spieler- oder Gegner-Basis zerstört werden so wird von der zerstörten Basis ein CustumEvent an das PlayerManager-Objekt gesendet. PlayerManager besitzt EventListener für den Fall "Spiel gewonnen", "Spiel verloren" die Handler der beiden Events laden den EndScreen mit dem passenden Text. <br> Wenn die Gegnerbasis weniger als die Hälfte des Ursprungslebens besitzt, so sendet sie ein Event an den AIManager. Der AIManager setzt im Handler-"changeToDefensive" den Zustand auf der KI defensiv.

## Bedienungsanleitung

### Partie starten
* starten des [Spiels](https://philippoesch.github.io/PRIMA_RTSGame/game/scenes/mainMenu.html)
* Play-Button betätigen und Schwierigkeit auswählen

### Im Spiel
#### Spiel Ziel
Ziel ist es, die Gegnerbasis (rot) zu zerstören, bevor die eigene Basis (blau) zerstört wird.
#### Einheiten kaufen
* Spielerbasis, sich auf der linken Seite befindend, anklicken
* Neben der Basis öffnet sich ein Kontextmenü
* Im Kontext Menü die gewünschte Einheit auswählen
* Danach spawn die Einheit unterhalb der Basis
* Ebenfalls möglich ist das Einheitenkaufen durch die Tasten Q (Tank-Einheit), W (Supertank-Einheit), E (Bomber-Einheit)
#### Selektieren der Spieler-Einheiten
* Mit der linken Maustaste auf eine Einheit drücken
* _oder_ mit der linken Maustasten gedrückt ein Rechteck um die gewünschten Einheiten ziehen und die Maustaste loslassen
* _oder_ mit der Taste A alle Spieler-Einheiten auf einmal auswählen
* ausgewählte Einheiten werden blau markiert
#### Steuern der ausgewählten Einheiten
* Mit der rechten Maustaste auf einen Punkt Im Spielfeld klicken - Einheiten bewegen sich dort hin
* Mit der rechten Maustaste auf ein Gegnerobjekt klicken - Einheiten greifen das Gegnerobjekt an
